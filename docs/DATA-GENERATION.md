# Data Generation Approach

## Overview

This package uses a clean data generation approach that prioritizes data integrity and standards compliance over completeness.

## Current Implementation (Cross-Referenced Data)

**Script:** `generate-crossref-timezone-data.js`  
**Command:** `npm run build:data`

### Principles

1. **Pure IANA Data**: Uses moment-timezone's official IANA timezone database as authoritative source
2. **Authoritative Country Mapping**: Cross-references with countries-and-timezones for country data
3. **Standards Compliance**: Maintains full compatibility with universal timezone standards
4. **Performance Optimized**: Pre-processed JSON for fast search operations
5. **Intelligent Selection**: Smart country selection for multi-country timezones

### Data Sources

- **Timezones**: moment-timezone (official IANA data) - 597 timezones
- **Abbreviations**: moment-timezone (historical and current)
- **Country Information**: countries-and-timezones (100% coverage) with intelligent primary country selection

### What's Included

- ✅ All 597 IANA timezone names
- ✅ City names (derived from IANA names)
- ✅ UTC offsets (current)
- ✅ Timezone abbreviations (filtered and cleaned)
- ✅ Country codes (93% coverage with intelligent selection)
- ✅ Country names (93% coverage with intelligent selection)

### Quality Metrics

- **Total timezones**: 597 (complete IANA set)
- **With country names**: 553/597 (93%)
- **With abbreviations**: 439/597 (74%)
- **File size**: ~119 KB (~36 KB gzipped)

## Alternative Implementation (Clean Data)

**Script:** `generate-clean-timezone-data.js`  
**Command:** `npm run build:data:clean`

This script generates data using only moment-timezone without any country mapping:

- Pure IANA data with no country information
- Smaller file size (~113 KB vs ~119 KB)
- Country fields intentionally left blank

## Legacy Implementation (Patched Data)

**Script:** `generate-timezone-data.js`  
**Command:** `npm run build:data:legacy`

This script includes manual country mapping and patches but is not recommended for production use due to:

- Manual fixes that may conflict with standards
- Heuristic-based country assignments
- Potential inaccuracies from supplemental data sources

## Search Impact

With cross-referenced data approach:
- ✅ All timezone searches work perfectly (MMT, EST, Tokyo, etc.)
- ✅ City-based searches are fully functional
- ✅ IANA name searches work completely
- ✅ Abbreviation searches work with historical data
- ✅ Country-based searches work for 93% of timezones
- ✅ Country code searches work (US, GB, JP, etc.)

## Rationale

This approach ensures:

1. **Data Integrity**: Authoritative IANA data with reliable country cross-referencing
2. **Standards Compliance**: Pure IANA data with standardized country mappings
3. **Maintainability**: Uses established npm packages for both timezone and country data
4. **Performance**: Optimized for search operations with rich metadata
5. **Reliability**: External, standardized data sources with intelligent selection logic
6. **Completeness**: 93% country coverage with smart primary country selection for multi-country zones

This approach provides the best balance of data integrity, completeness, and search functionality.
