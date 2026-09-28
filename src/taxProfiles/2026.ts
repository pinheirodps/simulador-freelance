// Estrutura de profile fiscal para 2026 (ESTIMATIVAS — validar com fontes oficiais)
// Valores preenchidos a partir das estimativas internas já presentes neste repositório
// (placeholders anteriores em store/src). Substitua pelos valores oficiais da AT /
// Segurança Social / Diário da República quando disponíveis.

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
  // Estimativa baseada nos placeholders já existentes no projeto (store/index.ts)
  // Verificar e substituir com os escalões oficiais publicados pela Autoridade Tributária
  irsBrackets: [
    { min: 0, max: 8500, rate: 0.125 },
    { min: 8500, max: 12500, rate: 0.16 },
    { min: 12500, max: 17500, rate: 0.215 },
    { min: 17500, max: 23000, rate: 0.244 },
    { min: 23000, max: 29000, rate: 0.314 },
    { min: 29000, max: 43000, rate: 0.349 },
    { min: 43000, max: 47000, rate: 0.431 },
    { min: 47000, max: 88000, rate: 0.446 },
    { min: 88000, max: null, rate: 0.48 },
  ],
  // Taxas de Segurança Social (estimativas)
  socialSecurity: {
    independentRate: 0.214, // taxa aplicada a trabalhadores independentes (estimativa)
    employerRate: 0.2375, // taxa suportada pelo empregador — usada em simulações CTI/Unipessoal
  },
  // IRC (empresa) — manter defaults razoáveis
  irc: {
    baseRate: 0.21,
    reducedRateThreshold: 150000,
    reducedRate: 0.165,
  },
  // IVA (valores padrão em Portugal)
  vatRates: {
    normal: 0.23,
    reduced: 0.13,
    reduced2: 0.06,
  },
  mealTicket: {
    // Valor isento por dia (estimativa). Em 2024/2025 o limite estava em ~9.6€;
    // aqui usamos 9.6€ como estimativa para 2026 — confirmar fonte oficial.
    exemptPerDay: 9.6,
  },
};

// NOTA IMPORTANTE:
// - Estes valores SÃO ESTIMATIVAS colocadas para permitir execução de testes e simulações.
// - Antes de publicar resultados como "oficiais", substitua por valores extraídos de:
//   * Autoridade Tributária e Aduaneira (https://www.portaldasfinancas.gov.pt)
//   * Segurança Social (https://www.seg-social.pt)
//   * Diário da República (https://dre.pt)
// - Comentários e referências foram adicionados para facilitar a revisão.
