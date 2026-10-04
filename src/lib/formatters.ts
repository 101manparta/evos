/**
 * Format a number into Indonesian Rupiah (IDR) currency standard.
 * e.g. 8600000 -> "Rp 8.600.000"
 */
export function formatIdr(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('id-ID').format(rounded);
  return `Rp ${formatted}`;
}

/**
 * Format a number into abbreviated IDR representation.
 * e.g. 8600000 -> "Rp 8.6M", 45000 -> "Rp 45K"
 */
export function formatIdrCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}K`;
  }
  return `Rp ${Math.round(amount)}`;
}

export function formatKm(km: number): string {
  return `${new Intl.NumberFormat('id-ID').format(km)} km`;
}

export function formatKwh(kwh: number): string {
  return `${kwh.toFixed(1)} kWh`;
}

export function formatPercent(val: number): string {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}
