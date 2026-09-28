import { createPinia, setActivePinia } from "pinia";
import { useTaxesStore, SUPPORTED_TAX_RANK_YEARS } from "../src/store/index";
import { useComparisonStore } from "../src/store/comparison";

console.log("=== VERIFYING 2026 UPDATE ===");
setActivePinia(createPinia());

// 1. Check supported years
console.log("Supported tax rank years:", SUPPORTED_TAX_RANK_YEARS);
if (SUPPORTED_TAX_RANK_YEARS[0] !== 2026) {
  throw new Error("Default year is not 2026!");
}
console.log("✓ 2026 is default year");

// 2. Check TaxesStore with 2026
const taxesStore = useTaxesStore();
taxesStore.setCurrentTaxRankYear(2026);

console.log("Current tax rank year:", taxesStore.getCurrentTaxRankYear);
console.log("2026 IAS:", taxesStore.currentIas);
if (taxesStore.currentIas !== 535.06) {
  throw new Error(`Expected IAS 535.06, got ${taxesStore.currentIas}`);
}
console.log("✓ IAS 2026 verified");

const ranks = taxesStore.getTaxRanks;
console.log(`✓ 2026 has ${ranks.length} tax brackets`);
if (ranks[0].max !== 8244 || ranks[0].normalTax !== 0.125) {
  throw new Error("Bracket 1 mismatch for 2026");
}
if (ranks[1].max !== 12440 || ranks[1].normalTax !== 0.16) {
  throw new Error("Bracket 2 mismatch for 2026");
}
if (ranks[5].max !== 42586 || ranks[5].normalTax !== 0.349) {
  throw new Error("Bracket 6 mismatch for 2026");
}
if (ranks[7].max !== 85621 || ranks[7].normalTax !== 0.446) {
  throw new Error("Bracket 8 mismatch for 2026");
}
console.log("✓ 2026 IRS tax brackets verified");

// 3. Test calculation for 60,000€ gross income
taxesStore.setIncome(60000);
console.log("Gross income year:", taxesStore.grossIncome.year);
console.log("Net income year:", taxesStore.netIncome.year);
console.log("IRS pay year:", taxesStore.irsPay.year);
console.log("SS pay year:", taxesStore.ssPay.year);
if (!taxesStore.netIncome.year || taxesStore.netIncome.year <= 0) {
  throw new Error("Net income calculation failed");
}
console.log("✓ 2026 Freelance simulation calculation passed");

// 4. Check ComparisonStore
const compStore = useComparisonStore();
compStore.setCurrentTaxRankYear(2026);
compStore.setIncome(60000);

console.log("2026 Minimum Wage:", compStore.currentMinimumWage);
if (compStore.currentMinimumWage !== 920) {
  throw new Error(`Expected minimum wage 920, got ${compStore.currentMinimumWage}`);
}
console.log("✓ 2026 minimum wage (920€) verified");

const comparisons = compStore.allComparisons;
console.log("Comparisons count:", comparisons.length);
for (const comp of comparisons) {
  console.log(`- ${comp.type}: Gross=${comp.grossIncome.year}€, Final Net=${comp.finalNetIncome.year.toFixed(2)}€`);
}
console.log("✓ All regime comparisons (Recibos Verdes, CTI, Unipessoal) calculated successfully");

console.log("=== ALL CHECKS PASSED ===");
