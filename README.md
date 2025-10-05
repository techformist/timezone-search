# timezone-search

An intelligent, zero-config NPM package for fuzzy searching IANA timezones by city, country, abbreviation, or IANA name. Just install and find the time, anywhere.

[![npm version](https://badge.fury.io/js/timezone-search.svg)](https://www.npmjs.com/package/timezone-search)
[![Downloads](https://img.shields.io/npm/dm/timezone-search.svg)](https://www.npmjs.com/package/timezone-search)
[![License](https://img.shields.io/npm/l/timezone-search.svg)](https://github.com/your-username/timezone-search/blob/main/LICENSE)

## Features

- 🚀 **Zero Configuration**: Works instantly after installation - no setup required
- ✨ **Complete Abbreviation Support**: Search by timezone abbreviations (EST, PST, AEST, JST, GMT, etc.) with prioritized results
- 🔍 **Fuzzy Search**: Find timezones even with typos or partial matches
- 🌍 **Multiple Search Types**: Search by city name, country, IANA timezone name, or abbreviations
- ⚡ **Fast Performance**: Optimized search with weighted results (abbreviations prioritized highest)
- 📦 **Self-Contained**: No external dependencies except Fuse.js - includes complete timezone database (597 timezones)
- 🎯 **Rich Results**: Returns comprehensive timezone information including UTC offsets, country data, and abbreviations
- 📘 **TypeScript Support**: Full type definitions included for enhanced developer experience
- 🏗️ **CI/CD Ready**: Automated testing and publishing via GitHub Actions
- 🔄 **Dual Package**: Supports both **CommonJS** (`require()`) and **ES Modules** (`import`) - works everywhere!
- 📱 **Modern & Legacy**: Compatible with Node.js, browsers, bundlers (Webpack, Vite, etc.)

## Installation

```bash
npm install timezone-search
```

## Usage

**timezone-search** supports both **CommonJS** and **ES Modules (ESM)** for maximum compatibility!

### CommonJS (Node.js)

```javascript
// CommonJS import
const { search } = require("timezone-search");
// or: const timezoneSearch = require("timezone-search");

// 🔥 NEW: Search by timezone abbreviations (prioritized results!)
const aestResults = search("AEST");
console.log(aestResults); // Returns all Australian Eastern timezones first

const estResults = search("EST");
console.log(estResults); // Returns US/Canadian Eastern timezones first

// Simple search by city
const results = search("London");
console.log(results);

// Search with a limit
const topResult = search("New York", { limit: 1 });
console.log(topResult);
```

### ES Modules (Modern JavaScript)

```javascript
// ES Module import (modern)
import { search } from "timezone-search";
// or: import timezoneSearch from "timezone-search";

// 🔥 NEW: Search by timezone abbreviations (prioritized results!)
const aestResults = search("AEST");
console.log(aestResults); // Returns all Australian Eastern timezones first

const estResults = search("EST");
console.log(estResults); // Returns US/Canadian Eastern timezones first

// Simple search by city
const results = search("London");
console.log(results);

// Search with a limit
const topResult = search("New York", { limit: 1 });
console.log(topResult);

// Fuzzy search handles typos
const fuzzyResults = search("Tokio"); // Will find Tokyo
console.log(fuzzyResults);

// Search by country
const japanTimezones = search("Japan");
console.log(japanTimezones);
```

### TypeScript Usage (Full Type Safety)

```typescript
// ES Module import with TypeScript
import { search, TimezoneResult, SearchOptions } from "timezone-search";
// or: import timezoneSearch from 'timezone-search';

// 🔥 NEW: Abbreviation search with full type safety
const aestZones: TimezoneResult[] = search("AEST");
console.log(aestZones[0].abbreviations); // "AEST,AEDT" (comma-separated string)
console.log(aestZones[0].city); // "Sydney" or "Melbourne"

// Simple search with type safety
const results: TimezoneResult[] = search("London");
console.log(results[0].iana); // "Europe/London"
console.log(results[0].city); // "London"

// Search with options
const options: SearchOptions = { limit: 5 };
const limitedResults: TimezoneResult[] = search("America", options);

// Access typed properties including abbreviations
limitedResults.forEach((timezone: TimezoneResult) => {
  console.log(
    `${timezone.city} (${timezone.countryName}): ${timezone.utcOffsetStr}`
  );
  console.log(`Abbreviations: ${timezone.abbreviations}`);
});
```

### Advanced Usage

```javascript
// Works with both CommonJS and ESM!
const { search } = require("timezone-search"); // CommonJS
// import { search } from "timezone-search";   // ESM

// Search with custom limit
const limitedResults = search("America", { limit: 5 });

// Search by country code
const usTimezones = search("US", { limit: 10 });

// Search by IANA timezone name
const specificZone = search("Europe/Budapest");

// Chain searches for more complex queries
const easternUS = search("EST").filter(tz => tz.countryCode === "US");
```

## API Reference

### `search(query, options)`

Searches for timezones based on the provided query.

**Parameters:**

- `query` (string): The search term (city, country, IANA name, etc.)
- `options` (object, optional): Configuration options
  - `options.limit` (number): Maximum number of results to return (default: 20)

**Returns:**

- Array of timezone objects matching the search query

**Example:**

```javascript
const results = timezoneSearch.search("Paris", { limit: 3 });
```

## Result Object Schema

Each result object contains the following properties:

```javascript
{
  "iana": "Europe/London",              // IANA timezone identifier
  "city": "London",                     // User-friendly city name
  "countryCode": "GB",                  // ISO country code
  "countryName": "United Kingdom",      // Full country name
  "utcOffset": 0,                       // UTC offset in minutes
  "utcOffsetStr": "+00:00",            // UTC offset as string
  "abbreviations": []                   // Array of timezone abbreviations
}
```

## Search Examples

### 🔥 NEW: By Timezone Abbreviations (Highest Priority)

```javascript
// Australian Eastern Standard Time
timezoneSearch.search("AEST");
// Returns: Sydney, Melbourne, Brisbane, Hobart, etc.

// Eastern Standard Time (US/Canada)
timezoneSearch.search("EST");
// Returns: New York, Toronto, Montreal, etc.

// Pacific Standard Time
timezoneSearch.search("PST");
// Returns: Los Angeles, Vancouver, etc.

// Japan Standard Time
timezoneSearch.search("JST");
// Returns: Tokyo, Osaka, etc.

// Central European Time
timezoneSearch.search("CET");
// Returns: Paris, Berlin, Rome, etc.

// Greenwich Mean Time
timezoneSearch.search("GMT");
// Returns: London, Dublin, etc.

// India Standard Time
timezoneSearch.search("IST");
// Returns: Kolkata, Mumbai, Delhi, etc.
```

### By City Name

```javascript
timezoneSearch.search("Tokyo");
timezoneSearch.search("New York");
timezoneSearch.search("São Paulo");
```

### By Country

```javascript
timezoneSearch.search("Japan");
timezoneSearch.search("United Kingdom");
timezoneSearch.search("Brazil");
```

### By Country Code

```javascript
timezoneSearch.search("US");
timezoneSearch.search("CA");
timezoneSearch.search("AU");
```

### By IANA Timezone

```javascript
timezoneSearch.search("America/New_York");
timezoneSearch.search("Europe/London");
timezoneSearch.search("Asia/Tokyo");
```

### Fuzzy Search Examples

```javascript
timezoneSearch.search("Londn"); // Finds London
timezoneSearch.search("New Yrok"); // Finds New York
timezoneSearch.search("Japn"); // Finds Japan timezones
```

## How It Works

The package automatically:

1. **Loads pre-compiled timezone data** from an embedded JSON database (597 complete timezones)
2. **Provides enriched data** with user-friendly city names, comprehensive metadata, and timezone abbreviations
3. **Initializes a fuzzy search index** using Fuse.js with optimized weights:
   - **Timezone abbreviations (weight: 1.0)** - highest priority for EST, PST, AEST, etc.
   - City names (weight: 0.8)
   - IANA timezone names (weight: 0.6)
   - Country names (weight: 0.4)
   - Country codes (weight: 0.3)
4. **Provides instant search results** ranked by relevance with abbreviations prioritized first

### 🏗️ Architecture Benefits

- **Self-contained**: No external API calls or data dependencies
- **Fast initialization**: Pre-processed data loads instantly
- **Abbreviation-first**: Smart prioritization for common timezone searches
- **Complete coverage**: 597 timezones with comprehensive abbreviation mapping

## Performance

- **First search**: ~20-50ms (includes pre-compiled data loading and index initialization)
- **Subsequent searches**: ~1-3ms (uses cached Fuse.js index)
- **Bundle size**: 25.8KB compressed (~39KB gzipped) - includes complete timezone database
- **Memory usage**: ~150KB - data is loaded once and reused
- **Abbreviation search**: Prioritized results in <1ms for common abbreviations

## Error Handling

The package handles edge cases gracefully:

- Empty or invalid queries return an empty array `[]`
- Zero or negative limits return an empty array `[]`
- Non-string queries are handled safely
- Special characters and accented text work correctly

## Dependencies

- **Runtime**: `fuse.js` only! (Self-contained timezone database)
- **Development**: `jest` for testing
- **Removed**: `countries-and-timezones` (now uses embedded data for better performance)

### Dependency Reduction 🎉

- **v1.0.0**: Reduced from 2 runtime dependencies to 1
- **Smaller bundle**: Eliminated external dependency overhead
- **Better reliability**: No risk of upstream package changes affecting functionality

## Testing

Run the test suite:

```bash
npm test
```

The package includes comprehensive tests covering:

- Basic functionality
- Search accuracy
- Edge cases and error handling
- Performance validation
- Result structure verification

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Keywords

timezone, tz, iana, search, fuzzy, autocomplete, time, world, zone, city, country
