export function integer(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}
export function milliseconds(value: number): string {
  return `${value.toFixed(value < 10 ? 2 : 1)} ms`
}
export function percent(value: number | null): string {
  return value === null ? 'n/a' : `${value.toFixed(1)}%`
}
export function bytes(value: number | null): string {
  if (value === null) return 'n/a'
  const units = ['B', 'KiB', 'MiB', 'GiB']
  const sign = value < 0 ? '-' : ''
  let amount = Math.abs(value)
  let unit = 0
  while (amount >= 1024 && unit < units.length - 1) {
    amount /= 1024
    unit++
  }
  return `${sign}${amount.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}
