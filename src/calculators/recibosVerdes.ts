import { GrossIncome, ContractComparison, ContractType, AdditionalExpenses } from '@/typings';
import { TaxProfile } from '@/taxProfiles/2026';

const YEAR_BUSINESS_DAYS = 248;

function clamp(v: number, min = 0) {
  return v > min ? v : min;
}

/**
 * calculateRecibosVerdes
 * - Implementação básica para Recibos Verdes usando o TaxProfile e opções fornecidas.
 * - Opções aceitas (exemplos):
 *   - firstYear (boolean)
 *   - secondYear (boolean)
 *   - ssDiscount (number) // e.g. -0.25..+0.25
 *   - currentIas (number) // monthly IAS
 *   - expenses (number) // declared annual expenses
 *   - maxExpensesTaxPercent (number) // percent (default 15)
 *   - benefitsOfYouthIrs (boolean)
 *   - youthIrsDiscount (number) // direct value in euros to subtract
 *   - nrMonthsDisplay (number) // defaults to 12
 *   - nrDaysOff (number) // defaults to 0
 */
export function calculateRecibosVerdes(
  grossIncome: GrossIncome,
  profile: TaxProfile,
  options: Record<string, any> = {}
): ContractComparison {
  const yearGross = clamp(grossIncome.year || 0);
  const monthGross = clamp(grossIncome.month || yearGross / 12);

  // SS rate
  const ssRate =
    (profile && profile.socialSecurity && profile.socialSecurity.independentRate) ||
    options.ssTax ||
    0.214;

  const currentIas = options.currentIas || 522.5; // fallback IAS monthly
  const maxSsIncome = 12 * currentIas;

  // SS first year exemption
  const ssFirstYear = !!options.ssFirstYear;

  // Calculate SS pay
  let ssPayYear = 0;
  let ssPayMonth = 0;
  let ssPayDay = 0;
  if (!ssFirstYear) {
    const ssDiscount = options.ssDiscount || 0;
    const baseMonthly = monthGross * 0.7 * (1 + ssDiscount);
    const monthSS = ssRate * Math.min(maxSsIncome, baseMonthly);
    ssPayMonth = Math.max(monthSS, 20);
    ssPayYear = Math.max(12 * monthSS, 20 * 12);
    ssPayDay = ssPayYear / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0));
  }

  const ssPay = {
    year: ssPayYear,
    month: ssPayMonth,
    day: ssPayDay,
  };

  // Specific deductions
  const specificDeductions = Math.max(4104, Math.min(ssPay.year, 0.1 * yearGross));

  // Max deductible expenses (simplified regime 15% default)
  const maxExpensesTaxPercent = options.maxExpensesTaxPercent ?? 15;
  const maxExpenses = (maxExpensesTaxPercent / 100) * yearGross;

  const declaredExpenses = clamp(options.expenses || 0);
  const expensesNeeded = clamp(maxExpenses - specificDeductions);
  const expensesMissing = expensesNeeded > declaredExpenses ? expensesNeeded - declaredExpenses : 0;

  // Youth IRS discount (optional)
  const youthIrsDiscount = options.youthIrsDiscount || 0;

  // Coefficient and first/second year discounts
  const coefficient = 0.75;
  const firstYear = !!options.firstYear;
  const secondYear = !!options.secondYear;
  const multiplier = coefficient * (firstYear ? 0.5 : secondYear ? 0.75 : 1);

  const taxableIncome = (yearGross - youthIrsDiscount) * multiplier + expensesMissing;

  // Compute IRS progressive tax using profile.irsBrackets if available
  let yearIRS = 0;
  if (profile && Array.isArray(profile.irsBrackets)) {
    for (const bracket of profile.irsBrackets) {
      const min = bracket.min || 0;
      const max = bracket.max === null || bracket.max === undefined ? Infinity : bracket.max;
      if (taxableIncome > min) {
        const taxablePortion = Math.min(max, taxableIncome) - min;
        if (taxablePortion > 0) {
          yearIRS += taxablePortion * bracket.rate;
        }
      }
      if (taxableIncome <= max) break;
    }
  }

  yearIRS = Math.max(0, yearIRS);
  const monthIRS = yearIRS / (options.nrMonthsDisplay || 12);
  const dayIRS = yearIRS / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0));

  const irsPay = {
    year: yearIRS,
    month: monthIRS,
    day: dayIRS,
  };

  const totalTaxes = {
    year: ssPay.year + irsPay.year,
    month: ssPay.month + irsPay.month,
    day: ssPay.day + irsPay.day,
  };

  const additionalExpenses: AdditionalExpenses = options.additionalExpenses || {};
  const totalAdditionalExpenses = clamp(options.totalAdditionalExpenses || 0);

  const netIncomeYear = yearGross - totalTaxes.year - totalAdditionalExpenses;
  const netIncomeMonth = monthGross - totalTaxes.month - totalAdditionalExpenses / 12;
  const netIncomeDay = netIncomeYear / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0));

  const netIncome = { year: netIncomeYear, month: netIncomeMonth, day: netIncomeDay };

  const totalExpenses = { year: declaredExpenses + totalAdditionalExpenses, month: (declaredExpenses + totalAdditionalExpenses) / 12, day: (declaredExpenses + totalAdditionalExpenses) / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0)) };

  const finalNetIncome = {
    year: netIncome.year,
    month: netIncome.month,
    day: netIncome.day,
  };

  return {
    type: ContractType.RecibosVerdes,
    grossIncome,
    irsPay,
    ssPay,
    netIncome,
    totalTaxes,
    additionalExpenses,
    totalExpenses,
    finalNetIncome,
  };
}
