// Browser-compatible ESM version
// Designed to work with modern bundlers (Vite, Webpack, Rollup, etc.)

import Fuse from 'fuse.js';

// Import timezone data - this approach works best with bundlers
// The bundler will inline this data at build time
let timezoneDataCache = null;
let fuse = null;

// For static imports, we'll try different approaches
async function loadTimezoneData() {
  if (timezoneDataCache) return timezoneDataCache;
  
  try {
    // Method 1: Try to import the JSON directly (works with Vite, modern Webpack)
    const dataModule = await import('./data/timezone-data.json');
    timezoneDataCache = dataModule.default || dataModule;
    
    // Validate the data
    if (Array.isArray(timezoneDataCache) && timezoneDataCache.length > 0) {
      return timezoneDataCache;
    }
  } catch (error) {
    console.warn('JSON import failed, trying fetch approach:', error.message);
  }
  
  // Method 2: Fallback to fetch with better error handling
  const possiblePaths = [
    new URL('./data/timezone-data.json', import.meta.url).href,
    './data/timezone-data.json',
    '/data/timezone-data.json',
    'data/timezone-data.json'
  ];
  
  for (const path of possiblePaths) {
    try {
      const response = await fetch(path);
      
      if (!response.ok) continue;
      
      const text = await response.text();
      
      // Check if we got HTML instead of JSON
      if (text.trim().startsWith('<')) {
        continue; // Skip HTML responses
      }
      
      timezoneDataCache = JSON.parse(text);
      
      if (Array.isArray(timezoneDataCache) && timezoneDataCache.length > 0) {
        return timezoneDataCache;
      }
    } catch (error) {
      // Continue to next path
    }
  }
  
  // Method 3: Last resort - provide some basic timezone data
  console.error('Could not load timezone data. Using minimal fallback data.');
  timezoneDataCache = [
    {
      iana: "America/New_York",
      city: "New York", 
      countryCode: "US",
      countryName: "United States of America",
      utcOffset: -300,
      utcOffsetStr: "-05:00",
      abbreviations: "EST,EDT"
    },
    {
      iana: "Europe/London",
      city: "London",
      countryCode: "GB", 
      countryName: "United Kingdom",
      utcOffset: 0,
      utcOffsetStr: "+00:00",
      abbreviations: "GMT,BST"
    },
    {
      iana: "Asia/Tokyo",
      city: "Tokyo",
      countryCode: "JP",
      countryName: "Japan", 
      utcOffset: 540,
      utcOffsetStr: "+09:00",
      abbreviations: "JST"
    }
  ];
  
  return timezoneDataCache;
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