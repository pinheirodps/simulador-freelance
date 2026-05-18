import { GrossIncome, ContractComparison, ContractType, Benefits } from '@/typings';
import { TaxProfile } from '@/taxProfiles/2026';

/**
 * calculateCTI
 * - Scaffold para cálculos de contrato de trabalho (retenção, SS empregado/empregador, custo empregador)
 */
export function calculateCTI(
  grossIncome: GrossIncome,
  profile: TaxProfile,
  options: Record<string, any> = {}
): ContractComparison {
  const zero = { year: 0, month: 0, day: 0 };
  const benefits: Benefits = {
    mealTicket: undefined,
  };
  return {
    type: ContractType.CTI,
    grossIncome,
    irsPay: zero,
    ssPay: zero,
    netIncome: grossIncome,
    totalTaxes: zero,
    employerCost: zero,
    benefits,
    totalExpenses: zero,
    finalNetIncome: grossIncome,
  };
}
