// Implementação do cálculo para CTI (Contrato de Trabalho)
import { GrossIncome, ContractComparison, ContractType, Benefits } from '@/typings';
import { TaxProfile } from '@/taxProfiles/2026';

const YEAR_BUSINESS_DAYS = 248;
const SS_WORKER_RATE = 0.11; // 11% worker contribution (approx)
const SS_EMPLOYER_RATE = 0.2375; // 23.75% employer contribution (approx)

function clamp(v: number, min = 0) {
  return v > min ? v : min;
}

export function calculateCTI(
  grossIncome: GrossIncome,
  profile: TaxProfile,
  options: Record<string, any> = {}
): ContractComparison {
  const nrDaysOff = options.nrDaysOff || 0;
  const ctiMonths = options.ctiMonths || 14; // commonly 14 months in PT
  const mealCardMonthly = clamp(options.mealCard || 0);
  const mealExemptPerDay = profile?.mealTicket?.exemptPerDay ?? 9.6;
  const businessDays = YEAR_BUSINESS_DAYS;

  const monthlySalary = clamp(grossIncome.month || (grossIncome.year ? grossIncome.year / ctiMonths : 0));
  const annualSalary = monthlySalary * 12;

  // Meal card exemption (approx 22 working days / month)
  const monthlyExempt = mealExemptPerDay * 22;
  const mealCardExempt = Math.min(monthlyExempt, mealCardMonthly);
  const mealCardTaxable = Math.max(0, mealCardMonthly - monthlyExempt);

  const monthlyGrossWithMealCard = monthlySalary + mealCardTaxable;
  const annualGrossWithMealCard = annualSalary + mealCardTaxable * 12;

  // Social security (worker)
  const ssWorkerYear = annualSalary * SS_WORKER_RATE;
  const ssWorkerMonth = ssWorkerYear / 12;
  const ssWorkerDay = ssWorkerYear / (businessDays - nrDaysOff);

  // Social security (employer)
  const ssEmployerYear = annualSalary * SS_EMPLOYER_RATE;
  const ssEmployerMonth = ssEmployerYear / 12;
  const ssEmployerDay = ssEmployerYear / (businessDays - nrDaysOff);

  // Specific deductions (basic, can be overridden)
  const specificDeductions = options.specificDeductions ?? 4104;

  // Taxable income for IRS (approx): use annualGrossWithMealCard minus specific deductions
  const annualTaxable = Math.max(0, annualGrossWithMealCard - specificDeductions);

  // IRS calculation using progressive brackets from profile if available
  let yearIRS = 0;
  if (profile && Array.isArray(profile.irsBrackets)) {
    for (const bracket of profile.irsBrackets) {
      const min = bracket.min || 0;
      const max = bracket.max === null || bracket.max === undefined ? Infinity : bracket.max;
      if (annualTaxable > min) {
        const taxablePortion = Math.min(max, annualTaxable) - min;
        if (taxablePortion > 0) {
          yearIRS += taxablePortion * bracket.rate;
        }
      }
      if (annualTaxable <= max) break;
    }
  } else {
    yearIRS = annualTaxable * (options.fallbackIrsRate ?? 0.2);
  }

  const monthIRS = yearIRS / 12;
  const dayIRS = yearIRS / (businessDays - nrDaysOff);

  // Net income
  const netMonthly = monthlySalary + mealCardExempt - ssWorkerMonth - monthIRS;
  // For annual net we consider payment over ctiMonths (14)
  const netAnnual = netMonthly * ctiMonths;
  const netDay = netAnnual / (businessDays - nrDaysOff);

  // Employer cost
  const employerCostYear = annualSalary + ssEmployerYear + mealCardMonthly * 12;
  const employerCostMonth = employerCostYear / 12;
  const employerCostDay = employerCostYear / (businessDays - nrDaysOff);

  const irsPay = { year: Math.max(0, yearIRS), month: Math.max(0, monthIRS), day: Math.max(0, dayIRS) };
  const ssPay = { year: ssWorkerYear, month: ssWorkerMonth, day: ssWorkerDay };
  const netIncome = { year: netAnnual, month: netMonthly, day: netDay };
  const totalTaxes = { year: irsPay.year + ssPay.year, month: irsPay.month + ssPay.month, day: irsPay.day + ssPay.day };

  const benefits: Benefits = {
    mealTicket: {
      year: mealCardMonthly * 12,
      month: mealCardMonthly,
      day: (mealCardMonthly * 12) / (businessDays - nrDaysOff),
    },
  };

  return {
    type: ContractType.CTI,
    grossIncome: { year: annualGrossWithMealCard, month: monthlyGrossWithMealCard, day: annualGrossWithMealCard / (businessDays - nrDaysOff) },
    irsPay,
    ssPay,
    netIncome,
    totalTaxes,
    employerCost: { year: employerCostYear, month: employerCostMonth, day: employerCostDay },
    benefits,
    totalExpenses: { year: totalTaxes.year, month: totalTaxes.month, day: totalTaxes.day },
    finalNetIncome: { year: netAnnual, month: netAnnual / 12, day: netDay }
  };
}
