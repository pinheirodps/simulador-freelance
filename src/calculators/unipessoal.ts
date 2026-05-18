import { GrossIncome, ContractComparison, ContractType, AdditionalExpenses } from '@/typings';
import { TaxProfile } from '@/taxProfiles/2026';

/**
 * calculateUnipessoal
 * - Scaffold para cálculos de sociedade unipessoal (IRC, pró-labore, distribuição de lucros)
 */
export function calculateUnipessoal(
  grossIncome: GrossIncome,
  profile: TaxProfile,
  options: Record<string, any> = {}
): ContractComparison {
  const zero = { year: 0, month: 0, day: 0 };
  const additionalExpenses: AdditionalExpenses = {};
  return {
    type: ContractType.Unipessoal,
    grossIncome,
    irsPay: zero,
    ssPay: zero,
    ircPay: zero,
    netIncome: grossIncome,
    totalTaxes: zero,
    additionalExpenses,
    totalExpenses: zero,
    finalNetIncome: grossIncome,
  };
}
