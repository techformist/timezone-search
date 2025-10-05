/**
 * Timezone object returned by search results
 */
export interface TimezoneResult {
  /** IANA timezone identifier (e.g., "America/New_York") */
  iana: string;
  /** User-friendly city name (e.g., "New York") */
  city: string;
  /** ISO country code (e.g., "US") */
  countryCode: string;
  /** Full country name (e.g., "United States of America") */
  countryName: string;
  /** UTC offset in minutes (e.g., -300 for EST) */
  utcOffset: number;
  /** UTC offset as string (e.g., "-05:00") */
  utcOffsetStr: string;
  /** Array of timezone abbreviations (e.g., ["EST", "EDT"]) */
  abbreviations: string[];
}

/**
 * Options for the search function
 */
export interface SearchOptions {
  /** Maximum number of results to return (default: 20) */
  limit?: number;
}

/**
 * Searches for timezones based on the provided query
 * 
 * @param query - The search term (city, country, IANA name, etc.)
 * @param options - Optional search configuration
 * @returns Array of timezone objects matching the search query
 * 
 * @example
 * ```typescript
 * import { search } from 'timezone-search';
 * 
 * // Simple search
 * const results = search('London');
 * 
 * // Search with limit
 * const limitedResults = search('America', { limit: 5 });
 * 
 * // Fuzzy search
 * const fuzzyResults = search('Tokio'); // Finds Tokyo
 * ```
 */
export function search(query: string, options?: SearchOptions): TimezoneResult[];

/**
 * Default export containing the search function
 */
declare const timezoneSearch: {
  search: typeof search;
};

export default timezoneSearch;