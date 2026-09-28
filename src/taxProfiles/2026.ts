export interface TaxProfile {
  year: number;
  minimumWage?: number;
  ias?: number;
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
  minimumWage: 920,
  ias: 535.06,
  irsBrackets: [
    { min: 0, max: 8244, rate: 0.125 },
    { min: 8244, max: 12440, rate: 0.16 },
    { min: 12440, max: 17629, rate: 0.215 },
    { min: 17629, max: 22819, rate: 0.244 },
    { min: 22819, max: 29053, rate: 0.314 },
    { min: 29053, max: 42586, rate: 0.349 },
    { min: 42586, max: 46022, rate: 0.431 },
    { min: 46022, max: 85621, rate: 0.446 },
    { min: 85621, max: null, rate: 0.48 },
  ],
  socialSecurity: {
    independentRate: 0.214,
    employerRate: 0.2375,
  },
  irc: {
    baseRate: 0.21,
    reducedRateThreshold: 50000,
    reducedRate: 0.17,
  },
  vatRates: {
    normal: 0.23,
    reduced: 0.13,
    reduced2: 0.06,
  },
  mealTicket: {
    exemptPerDay: 9.6,
  },
};
