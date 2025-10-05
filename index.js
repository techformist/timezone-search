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
 * Custom scoring function that prioritizes abbreviation matches
 * @param {string} query - The search term
 * @param {Object} item - The timezone item to score
 * @param {number} fuseScore - The original Fuse.js score (lower is better)
 * @returns {number} Custom score (lower is better)
 */
function calculateCustomScore(query, item, fuseScore) {
  const queryLower = query.toLowerCase();
  const queryUpper = query.toUpperCase();
  
  // Parse abbreviations into array
  const abbreviations = item.abbreviations ? item.abbreviations.split(',') : [];
  
  // Priority 1: Exact abbreviation match (best score)
  if (abbreviations.includes(queryUpper)) {
    return 0.01; // Highest priority
  }
  
  // Priority 2: Partial abbreviation match
  const hasPartialAbbrevMatch = abbreviations.some(abbr => 
    abbr.toLowerCase().includes(queryLower) || queryLower.includes(abbr.toLowerCase())
  );
  if (hasPartialAbbrevMatch) {
    return 0.1 + (fuseScore * 0.1); // High priority with slight Fuse influence
  }
  
  // Priority 3: Exact city match
  if (item.city.toLowerCase() === queryLower) {
    return 0.5 + (fuseScore * 0.1); // Medium priority
  }
  
  // Priority 4: Exact country match
  if (item.countryName.toLowerCase() === queryLower) {
    return 0.6 + (fuseScore * 0.1); // Medium priority
  }
  
  // Priority 5: Exact IANA match
  if (item.iana.toLowerCase() === queryLower) {
    return 0.7 + (fuseScore * 0.1); // Medium-low priority
  }
  
  // Priority 6: All other matches use Fuse score + penalty
  return 1.0 + fuseScore; // Lower priority, rely on Fuse fuzzy matching
}

/**
 * Searches for timezones based on the provided query with intelligent prioritization
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
  
  // Apply custom scoring and sort
  const scoredResults = results
    .map(result => ({
      ...result.item,
      customScore: calculateCustomScore(query, result.item, result.score || 1)
    }))
    .sort((a, b) => a.customScore - b.customScore) // Lower score = higher priority
    .slice(0, limit)
    .map(result => {
      // Remove the customScore property from final results
      const { customScore, ...item } = result;
      return item;
    });
  
  return scoredResults;
}

module.exports = {
  search
};