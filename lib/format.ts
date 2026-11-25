const COMPACT = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const FULL = new Intl.NumberFormat("fr-FR");

const CURRENCY = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatCompact(value: number): string {
  return COMPACT.format(value);
}

export function formatNumber(value: number): string {
  return FULL.format(value);
}

export function formatCurrency(value: number): string {
  return CURRENCY.format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)} %`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  const units = ["Ko", "Mo", "Go"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
}

export function formatDelta(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1).replace(".", ",")} %`;
}
