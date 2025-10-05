const Fuse = require('fuse.js');
const fs = require('fs');
const path = require('path');

// Global variables to store the Fuse instance
let fuse = null;
let cachedData = null;

/**
 * Returns pre-generated timezone data from JSON file
 * @returns {Array} Array of timezone objects
 */
function getTimezoneData() {
  if (cachedData) {
    return cachedData;
  }

  try {
    // Load pre-generated timezone data
    const dataPath = path.join(__dirname, 'data', 'timezone-data.json');
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    cachedData = JSON.parse(jsonData);
    
    return cachedData;
  } catch (error) {
    console.error('Failed to load timezone data:', error.message);
    // Fallback: return empty array
    return [];
  }
}

/**
 * Initializes the Fuse search instance with configured options
 * @returns {Fuse} The configured Fuse instance
 */
function initializeFuse() {
  if (fuse) {
    return fuse;
  }

  const data = getTimezoneData();
  
  const fuseOptions = {
    includeScore: true,
    threshold: 0.4,
    keys: [
      { name: 'abbreviations', weight: 1.0 },  // Highest priority for timezone abbreviations
      { name: 'city', weight: 0.8 },           // City names second priority
      { name: 'iana', weight: 0.6 },           // IANA names third priority
      { name: 'countryName', weight: 0.4 },    // Country names fourth priority
      { name: 'countryCode', weight: 0.3 }     // Country codes lowest priority
    ]
  };

  fuse = new Fuse(data, fuseOptions);
  return fuse;
}

/**
 * Searches for timezones based on the provided query
 * @param {string} query - The search term
 * @param {Object} options - Search options
 * @param {number} options.limit - Maximum number of results to return (default: 20)
 * @returns {Array} Array of timezone objects matching the search query
 */
function search(query, options = {}) {
  // Return empty array for empty, null, or undefined queries
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return [];
  }

  // Initialize Fuse if not already done
  const fuseInstance = initializeFuse();
  
  // Set default limit and handle edge cases
  const limit = options.limit !== undefined ? options.limit : 20;
  
  // Handle zero or negative limits
  if (limit <= 0) {
    return [];
  }
  
  // Perform the search
  const results = fuseInstance.search(query);
  
  // Extract just the item data (without Fuse metadata) and apply limit
  return results
    .slice(0, limit)
    .map(result => result.item);
}

module.exports = {
  search
};