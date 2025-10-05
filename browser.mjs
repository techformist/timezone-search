// Browser-compatible ESM version
// Designed to work with modern bundlers (Vite, Webpack, Rollup, etc.)

import Fuse from 'fuse.js';

// Timezone data cache
let timezoneDataCache = null;
let fuse = null;

/**
 * Load timezone data (works with bundlers)
 */
async function loadTimezoneData() {
  if (timezoneDataCache) return timezoneDataCache;
  
  try {
    // For bundlers, this will be resolved at build time
    const response = await fetch('./data/timezone-data.json');
    timezoneDataCache = await response.json();
    return timezoneDataCache;
  } catch (error) {
    console.warn('Could not load timezone data:', error.message);
    timezoneDataCache = [];
    return timezoneDataCache;
  }
}

/**
 * Initialize Fuse search instance
 */
async function initializeFuse() {
  if (fuse) return fuse;

  const data = await loadTimezoneData();
  
  const fuseOptions = {
    includeScore: true,
    threshold: 0.4,
    keys: [
      { name: 'abbreviations', weight: 1.0 },
      { name: 'city', weight: 0.8 },
      { name: 'iana', weight: 0.6 },
      { name: 'countryName', weight: 0.4 },
      { name: 'countryCode', weight: 0.3 }
    ]
  };

  fuse = new Fuse(data, fuseOptions);
  return fuse;
}

/**
 * Search for timezones
 * @param {string} query - The search term
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of timezone objects matching the search query
 */
export async function search(query, options = {}) {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return [];
  }

  const fuseInstance = await initializeFuse();
  const limit = options.limit !== undefined ? options.limit : 20;
  
  if (limit <= 0) return [];
  
  const results = fuseInstance.search(query);
  return results.slice(0, limit).map(result => result.item);
}

// Default export
export default { search };