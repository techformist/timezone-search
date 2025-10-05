# Project Structure

This package follows Node.js conventions with a clean separation of concerns:

## Root Directory
```
timezone-search/
├── index.js            # Main entry point (CommonJS)
├── index.mjs           # ES Module entry point  
├── index.d.ts          # TypeScript definitions
├── browser.mjs         # Browser-optimized build
├── package.json        # Package configuration
├── README.md           # User documentation
├── LICENSE            # MIT license
└── .github/           # GitHub workflows
```

## Core Directories

### `data/`
Pre-generated timezone data files:
- `timezone-data.json` - Cross-referenced IANA + country data (119 KB)

### `scripts/` 
Data generation utilities:
- `generate-crossref-timezone-data.js` - **Default**: Cross-referenced approach
- `generate-clean-timezone-data.js` - Pure IANA data only
- `generate-timezone-data.js` - Legacy patched approach

### `docs/`
Documentation files:
- `DATA-GENERATION.md` - Data generation approaches and rationale
- `BUNDLER-CONFIG.md` - Bundler configuration guidance

### `tests/`
Test files:
- `index.test.js` - Main test suite (Jest)
- `test-types.ts` - TypeScript type tests

## Build Commands

- `npm run build:data` - Generate cross-referenced data (recommended)
- `npm run build:data:clean` - Generate clean IANA-only data
- `npm run build:data:legacy` - Generate legacy patched data

## Design Principles

1. **Main Function First**: Search functionality is the primary interface
2. **Generation is Supportive**: Data generation scripts are utilities, not core functionality
3. **No Temporary Files**: All generated files serve a purpose
4. **Standard Conventions**: Follows Node.js package structure best practices
5. **Clear Separation**: Scripts, docs, tests, and data are properly organized

## Published Files

The package publishes only essential files (see `package.json` `files` field):
- Core library files (`index.*`, `browser.mjs`)
- Data directory (`data/`)
- Scripts directory (`scripts/`) 
- Documentation (`docs/`)
- Standard files (`README.md`, `LICENSE`)

No temporary files, build artifacts, or development-only files are included in the published package.