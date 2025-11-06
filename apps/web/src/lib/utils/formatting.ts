/**
 * Shared Formatting Utilities
 * Purpose: Centralized data formatting functions - currency, percentages, numbers
 * Benefits: Consistent number formatting across app, easy locale changes, single source of truth
 */

/**
 * Format currency value (KRW or USD)
 * @param value - Numeric value to format
 * @param currency - Currency code ('KRW', 'USD', 'JPY')
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: 'KRW' | 'USD' | 'JPY' = 'KRW',
  decimals: number = 0
): string {
  const absValue = Math.abs(value);

  // Format with appropriate scale
  let formattedValue: string;

  if (absValue >= 1_000_000_000) {
    // Billions
    formattedValue = (value / 1_000_000_000).toFixed(decimals) + 'B';
  } else if (absValue >= 1_000_000) {
    // Millions
    formattedValue = (value / 1_000_000).toFixed(decimals) + 'M';
  } else if (absValue >= 1_000) {
    // Thousands
    formattedValue = (value / 1_000).toFixed(decimals) + 'K';
  } else {
    // Regular format
    formattedValue = value.toFixed(decimals);
  }

  // Add currency symbol based on type
  const symbols = {
    'KRW': '₩',
    'USD': '$',
    'JPY': '¥',
  };

  return `${symbols[currency]}${formattedValue}`;
}

/**
 * Format percentage value
 * @param value - Numeric value (0-100 or 0-1)
 * @param decimals - Number of decimal places (default: 2)
 * @param isDecimal - Whether value is in decimal format (0-1) or percentage format (0-100)
 * @returns Formatted percentage string
 */
export function formatPercent(
  value: number,
  decimals: number = 2,
  isDecimal: boolean = true
): string {
  const percentValue = isDecimal ? value * 100 : value;
  return `${percentValue.toFixed(decimals)}%`;
}

/**
 * Format generic number with thousand separators
 * @param value - Numeric value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  const parts = value.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Format with sign indicator (+/-)
 * @param value - Numeric value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number with sign
 */
export function formatWithSign(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}`;
}

/**
 * Format large numbers with scaling (K, M, B, T)
 * @param value - Numeric value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number with scale suffix
 */
export function formatScale(value: number, decimals: number = 1): string {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(decimals) + 'T';
  } else if (absValue >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(decimals) + 'B';
  } else if (absValue >= 1_000_000) {
    return (value / 1_000_000).toFixed(decimals) + 'M';
  } else if (absValue >= 1_000) {
    return (value / 1_000).toFixed(decimals) + 'K';
  }
  return value.toFixed(decimals);
}

/**
 * Format date to readable string
 * @param date - Date object or ISO string
 * @param format - Format type ('short', 'long', 'numeric')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'numeric' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'numeric' ? '2-digit' : format === 'short' ? 'short' : 'long',
    day: '2-digit',
  };

  return dateObj.toLocaleDateString('ko-KR', options);
}

/**
 * Format time to readable string
 * @param date - Date object or ISO string
 * @returns Formatted time string (HH:MM:SS)
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Get color class based on value trend (up/down/neutral)
 * @param value - Numeric value
 * @returns Tailwind color class string
 */
export function getTrendColorClass(value: number): string {
  if (value > 0) return 'text-green-400';  // Positive
  if (value < 0) return 'text-red-400';    // Negative
  return 'text-gray-400';                   // Neutral
}

/**
 * Get trend arrow symbol
 * @param value - Numeric value
 * @returns Arrow symbol (↑, ↓, →)
 */
export function getTrendArrow(value: number): string {
  if (value > 0) return '↑';
  if (value < 0) return '↓';
  return '→';
}

/**
 * Format ratio/metric value (e.g., NIM, ROE, etc.)
 * @param value - Numeric value
 * @param metricType - Type of metric
 * @returns Formatted metric string
 */
export function formatMetric(
  value: number,
  metricType: 'percentage' | 'ratio' | 'basis_points' | 'count' = 'percentage'
): string {
  switch (metricType) {
    case 'percentage':
      return formatPercent(value);
    case 'ratio':
      return value.toFixed(2) + 'x';
    case 'basis_points':
      return (value * 100).toFixed(0) + 'bps';
    case 'count':
      return formatNumber(value, 0);
    default:
      return value.toFixed(2);
  }
}

/**
 * Abbreviate long text with ellipsis
 * @param text - Text to abbreviate
 * @param maxLength - Maximum length before truncation
 * @returns Abbreviated text
 */
export function abbreviateText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Parse currency string back to number
 * @param currencyStr - Formatted currency string
 * @returns Numeric value
 */
export function parseCurrency(currencyStr: string): number {
  const cleanStr = currencyStr.replace(/[₩$¥,]/g, '');
  const scale = {
    'B': 1_000_000_000,
    'M': 1_000_000,
    'K': 1_000,
  };

  for (const [suffix, multiplier] of Object.entries(scale)) {
    if (cleanStr.endsWith(suffix)) {
      return parseFloat(cleanStr.slice(0, -1)) * multiplier;
    }
  }

  return parseFloat(cleanStr);
}

/**
 * Parse percentage string back to number
 * @param percentStr - Formatted percentage string
 * @param isDecimal - Whether to return as decimal (0-1) or percentage (0-100)
 * @returns Numeric value
 */
export function parsePercent(percentStr: string, isDecimal: boolean = true): number {
  const value = parseFloat(percentStr.replace('%', ''));
  return isDecimal ? value / 100 : value;
}
