export const round = (num: number, decimal = 0): number => {
  const factor = Math.pow(10, decimal);
  return Math.round(num * factor) / factor;
};

export const formatNumber = (num: number, locale = "pt-PT", decimalPlaces = 0): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(num);
};

export const spacedNumber = (num: number | null | undefined, decimalPlaces = 0, locale = "pt-PT") => {
  if (num === null || num === undefined) return "";
  return formatNumber(num, locale, decimalPlaces);
};

export const asCurrency = (num: number, decimalPlaces = 2, locale = "pt-PT", currency = "EUR"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(num);
};

export const asPercentage = (num: number, decimal = 1, locale = "pt-PT") => {
  return `${round(num * 100, decimal)}%`;
};

export const reverseCurrency = (value: string): number => {
  if (!value) return NaN;
  const cleaned = value.replace(/[^[0-9\-,.]/g, "").replace(/,/g, ".");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : NaN;
};

export const formatISOString = (isoString: string, locale: string = "pt-PT"): string => {
  return new Date(isoString).toLocaleString(locale);
};

export const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }
  // fallback (not cryptographically strong)
  const uuid: string[] = [];
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid[i] = "-";
    } else if (i === 14) {
      uuid[i] = "4";
    } else if (i === 19) {
      uuid[i] = ((Math.floor(Math.random() * 4) + 8)).toString(16);
    } else {
      uuid[i] = Math.floor(Math.random() * 16).toString(16);
    }
  }
  return uuid.join("");
};
