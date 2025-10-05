// Test file to verify TypeScript definitions work correctly
// This file is not included in the package, just for testing types

import { search, TimezoneResult, SearchOptions } from '../index';

// Test basic search
const results: TimezoneResult[] = search('London');

// Test result properties
const firstResult: TimezoneResult = results[0];
const iana: string = firstResult.iana;
const city: string = firstResult.city;
const countryCode: string = firstResult.countryCode;
const countryName: string = firstResult.countryName;
const utcOffset: number = firstResult.utcOffset;
const utcOffsetStr: string = firstResult.utcOffsetStr;
const abbreviations: string[] = firstResult.abbreviations;

// Test search with options
const options: SearchOptions = { limit: 5 };
const limitedResults: TimezoneResult[] = search('America', options);

// Test optional limit
const optionalLimitResults: TimezoneResult[] = search('Europe', { limit: 10 });

// Test without options
const noOptionsResults: TimezoneResult[] = search('Asia');

console.log('TypeScript types test passed!');
console.log(`Found ${results.length} results for London`);
console.log(`First result: ${firstResult.city}, ${firstResult.countryName}`);