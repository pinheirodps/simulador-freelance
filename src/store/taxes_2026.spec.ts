import { setActivePinia, createPinia } from "pinia";
import { useTaxesStore } from "./index";
import { useComparisonStore } from "./comparison";
import { describe, it, expect, beforeEach } from "vitest";

describe("Taxes Store - Fiscal 2026 Verification", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should calculate IRS correctly for 2026 - Bracket 1 (12.5%)", () => {
    const store = useTaxesStore();
    store.setCurrentTaxRankYear(2026);
    const ranks = store.getTaxRanks;
    expect(ranks[0].max).toBe(8244);
    expect(ranks[0].normalTax).toBe(0.125);
    expect(ranks[0].averageTax).toBe(0.125);
  });

  it("should calculate IRS correctly for 2026 - Bracket 2 (16.0%)", () => {
    const store = useTaxesStore();
    store.setCurrentTaxRankYear(2026);
    const ranks = store.getTaxRanks;
    expect(ranks[1].min).toBe(8244);
    expect(ranks[1].max).toBe(12440);
    expect(ranks[1].normalTax).toBe(0.16);
    expect(ranks[1].averageTax).toBe(0.1368);
  });

  it("should calculate IRS correctly for 2026 - Bracket 6 (34.9%)", () => {
    const store = useTaxesStore();
    store.setCurrentTaxRankYear(2026);
    const ranks = store.getTaxRanks;
    expect(ranks[5].min).toBe(29053);
    expect(ranks[5].max).toBe(42586);
    expect(ranks[5].normalTax).toBe(0.349);
    expect(ranks[5].averageTax).toBe(0.2528);
  });

  it("should calculate IRS correctly for 2026 - Bracket 8 (44.6%)", () => {
    const store = useTaxesStore();
    store.setCurrentTaxRankYear(2026);
    const ranks = store.getTaxRanks;
    expect(ranks[7].min).toBe(46022);
    expect(ranks[7].max).toBe(85621);
    expect(ranks[7].normalTax).toBe(0.446);
    expect(ranks[7].averageTax).toBe(0.3493);
  });

  it("should use correct 2026 IAS (535.06)", () => {
    const store = useTaxesStore();
    store.setCurrentTaxRankYear(2026);
    expect(store.currentIas).toBe(535.06);
    expect(store.maxSsIncome).toBe(12 * 535.06);
  });

  it("should support 10 years for Youth IRS in 2026", () => {
    const store = useTaxesStore();
    store.setCurrentTaxRankYear(2026);
    expect(store.youthIrsRange).toBe(10);
    expect(store.isYearOfYouthIrsValid(1)).toBe(true);
    expect(store.isYearOfYouthIrsValid(10)).toBe(true);
    expect(store.isYearOfYouthIrsValid(11)).toBe(false);
  });

  it("should use 920€ minimum wage for 2026 in Comparison Store", () => {
    const comparisonStore = useComparisonStore();
    comparisonStore.setCurrentTaxRankYear(2026);
    expect(comparisonStore.currentMinimumWage).toBe(920);

    comparisonStore.setCurrentTaxRankYear(2025);
    expect(comparisonStore.currentMinimumWage).toBe(870);

    comparisonStore.setCurrentTaxRankYear(2024);
    expect(comparisonStore.currentMinimumWage).toBe(820);
  });
});
