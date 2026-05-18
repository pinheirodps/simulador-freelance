import { GrossIncome, ContractComparison, ContractType, AdditionalExpenses } from '@/typings';
import { TaxProfile } from '@/taxProfiles/2026';

const YEAR_BUSINESS_DAYS = 248;
const SS_WORKER_RATE = 0.11; // worker contribution (approx)
const SS_EMPLOYER_RATE = 0.2375; // employer contribution (approx)

function clamp(v: number, min = 0) {
  return v > min ? v : min;
}

/**
 * calculateUnipessoal
 * - Implementação simplificada para sociedade unipessoal
 * - Modes: 'salary' (partner withdraws salary) or 'profitDistribution' (minimal salary + dividends)
 * - Options:
 *   - remunerationType: 'salary' | 'profitDistribution'
 *   - partnerSalary: number (annual)
 *   - additionalExpenses: object
 *   - dividendTaxRate: number (default 0.28)
 *   - ircRate: number (company tax rate, default 0.21)
 */
export function calculateUnipessoal(
  grossIncome: GrossIncome,
  profile: TaxProfile,
  options: Record<string, any> = {}
): ContractComparison {
  const yearGross = clamp(grossIncome.year || 0);
  const monthGross = clamp(grossIncome.month || yearGross / 12);

  const remunerationType = options.remunerationType || 'profitDistribution';
  // partnerSalary: annual amount. If not provided and salary mode, assume 60% of gross or 1/2 as heuristic
  let partnerSalary = typeof options.partnerSalary === 'number' ? options.partnerSalary : 0;
  if (remunerationType === 'salary' && partnerSalary === 0) {
    partnerSalary = Math.round(yearGross * 0.6);
  }

  const additionalExpenses = options.additionalExpenses || {} as AdditionalExpenses;
  const totalAdditionalExpenses = clamp(options.totalAdditionalExpenses || 0);
  const deductibleExpenses = clamp(options.deductibleExpenses || 0);

  // Company taxable profit before IRC = revenue - partnerSalary (as expense) - deductible expenses
  const taxableProfitBeforeIrc = Math.max(0, yearGross - partnerSalary - deductibleExpenses - totalAdditionalExpenses);

  const ircRate = options.ircRate ?? profile?.ircRate ?? 0.21; // default 21%
  const ircPayYear = taxableProfitBeforeIrc * ircRate;

  const profitAfterIrc = Math.max(0, taxableProfitBeforeIrc - ircPayYear);

  const dividendTaxRate = options.dividendTaxRate ?? 0.28;
  const dividendsDistributed = profitAfterIrc; // assume all profit distributed
  const dividendTax = dividendsDistributed * dividendTaxRate;
  const dividendsNet = dividendsDistributed - dividendTax;

  // Partner personal IRS on salary (if any)
  let partnerIrsYear = 0;
  if (partnerSalary > 0 && profile && Array.isArray(profile.irsBrackets)) {
    const annualTaxable = Math.max(0, partnerSalary - (options.specificDeductions ?? 4104));
    for (const bracket of profile.irsBrackets) {
      const min = bracket.min || 0;
      const max = bracket.max === null || bracket.max === undefined ? Infinity : bracket.max;
      if (annualTaxable > min) {
        const taxablePortion = Math.min(max, annualTaxable) - min;
        if (taxablePortion > 0) {
          partnerIrsYear += taxablePortion * bracket.rate;
        }
      }
      if (annualTaxable <= max) break;
    }
  }

  // Partner SS on salary
  const ssPartnerYear = partnerSalary * SS_WORKER_RATE;
  const ssPartnerMonth = ssPartnerYear / 12;
  const ssPartnerDay = ssPartnerYear / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0));

  // Employer SS cost
  const ssEmployerYear = partnerSalary * SS_EMPLOYER_RATE;

  // Totals
  const irsPayYear = partnerIrsYear + dividendTax; // partner IRS + dividend tax (simplified)
  const irsPay = { year: irsPayYear, month: irsPayYear / 12, day: irsPayYear / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0)) };
  const ssPay = { year: ssPartnerYear, month: ssPartnerMonth, day: ssPartnerDay };
  const ircPay = { year: ircPayYear, month: ircPayYear / 12, day: ircPayYear / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0)) };

  const totalTaxes = { year: ircPay.year + irsPay.year + ssPay.year, month: ircPay.month + irsPay.month + ssPay.month, day: ircPay.day + irsPay.day + ssPay.day };

  // Net to partner: salary net + dividends net
  const salaryNetYear = partnerSalary - partnerIrsYear - ssPartnerYear;
  const partnerNetYear = salaryNetYear + dividendsNet;
  const partnerNetMonth = partnerNetYear / 12;
  const partnerNetDay = partnerNetYear / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0));

  const netIncome = { year: partnerNetYear, month: partnerNetMonth, day: partnerNetDay };

  const employerCostYear = partnerSalary + ssEmployerYear + totalAdditionalExpenses;

  return {
    type: ContractType.Unipessoal,
    grossIncome: { year: yearGross, month: monthGross, day: yearGross / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0)) },
    irsPay,
    ssPay,
    ircPay,
    netIncome,
    totalTaxes,
    additionalExpenses: additionalExpenses,
    totalExpenses: { year: deductibleExpenses + totalAdditionalExpenses, month: (deductibleExpenses + totalAdditionalExpenses) / 12, day: (deductibleExpenses + totalAdditionalExpenses) / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0)) },
    finalNetIncome: netIncome,
    employerCost: { year: employerCostYear, month: employerCostYear / 12, day: employerCostYear / (YEAR_BUSINESS_DAYS - (options.nrDaysOff || 0)) }
  };
}
