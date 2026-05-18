// Estrutura de profile fiscal para 2026 (placeholders — validar valores oficiais)
export interface TaxProfile {
  year: number;
  irsBrackets: Array<{ min: number; max: number | null; rate: number }>;
  socialSecurity: {
    independentRate: number;
    employerRate?: number;
  };
  irc: {
    baseRate: number;
    reducedRateThreshold?: number;
    reducedRate?: number;
  };
  vatRates: {
    normal: number;
    reduced: number;
    reduced2?: number;
  };
  mealTicket: {
    exemptPerDay: number;
  };
}

export const profile2026: TaxProfile = {
  year: 2026,
  irsBrackets: [
    // TODO: preencher com valores oficiais 2026
    { min: 0, max: 7000, rate: 0.145 },
    { min: 7000, max: 20000, rate: 0.28 },
    { min: 20000, max: 40000, rate: 0.37 },
    { min: 40000, max: null, rate: 0.48 },
  ],
  socialSecurity: {
    independentRate: 0.215, // placeholder — confirmar
    employerRate: 0.2375, // placeholder — confirmar
  },
  irc: {
    baseRate: 0.21,
    reducedRateThreshold: 150000,
    reducedRate: 0.165,
  },
  vatRates: {
    normal: 0.23,
    reduced: 0.13,
    reduced2: 0.06,
  },
  mealTicket: {
    exemptPerDay: 8.32, // placeholder — confirmar
  },
};
