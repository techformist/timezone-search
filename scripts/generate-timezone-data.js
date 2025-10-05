// Comprehensive timezone data generator using proper IANA data
const fs = require('fs');

// Install required packages
console.log('📦 Installing required packages...');
const { execSync } = require('child_process');
try {
    execSync('npm install --save-dev moment-timezone countries-and-timezones', { stdio: 'inherit' });
} catch (error) {
    console.error('Failed to install packages:', error.message);
    process.exit(1);
}

const moment = require('moment-timezone');
const ct = require('countries-and-timezones');

console.log('🚀 Generating comprehensive timezone data...\n');

// Get complete country data
const countries = ct.getAllCountries();
const timezones = ct.getAllTimezones();

console.log(`📊 Source data:
- Countries: ${Object.keys(countries).length}
- Timezones: ${Object.keys(timezones).length}
- Moment timezones: ${moment.tz.names().length}`);

// Enhanced country mapping using multiple sources
function getCountryInfo(iana) {
    // First try: Direct lookup from countries-and-timezones with smart country selection
    const tzData = ct.getTimezone(iana);
    if (tzData && tzData.countries && tzData.countries.length > 0) {
        // If multiple countries, pick the most logical one based on timezone name
        let bestCountry = tzData.countries[0];
        
        // Smart selection for common ambiguities
        if (iana === 'Asia/Tokyo' && tzData.countries.includes('JP')) {
            bestCountry = 'JP';  // Tokyo should be Japan, not Australia
        } else if (iana.startsWith('Asia/') && tzData.countries.includes('JP')) {
            bestCountry = 'JP';  // Prefer Japan for Asian timezones
        } else if (iana.startsWith('Europe/') && tzData.countries.length > 1) {
            // For European timezones, prefer based on city name
            const city = iana.split('/')[1];
            if (city === 'London' && tzData.countries.includes('GB')) bestCountry = 'GB';
            else if (city === 'Paris' && tzData.countries.includes('FR')) bestCountry = 'FR';
            else if (city === 'Berlin' && tzData.countries.includes('DE')) bestCountry = 'DE';
        }
        
        const country = countries[bestCountry];
        if (country) {
            return {
                code: bestCountry,
                name: country.name
            };
        }
    }
    
    // Second try: Search through all countries for this timezone
    for (const [countryCode, country] of Object.entries(countries)) {
        if (country.timezones && country.timezones.includes(iana)) {
            return {
                code: countryCode,
                name: country.name
            };
        }
    }
    
    // Third try: Infer from IANA name patterns
    const [region, city] = iana.split('/');
    
    if (region === 'America') {
        // Special handling for Americas
        if (iana.includes('Toronto') || iana.includes('Montreal') || iana.includes('Vancouver') || 
            iana.includes('Halifax') || iana.includes('Winnipeg') || iana.includes('Edmonton') || 
            iana.includes('Calgary') || iana.includes('Regina')) {
            return { code: 'CA', name: 'Canada' };
        }
        if (iana.includes('Mexico') || iana.includes('Tijuana') || iana.includes('Cancun')) {
            return { code: 'MX', name: 'Mexico' };
        }
        if (iana.includes('Sao_Paulo') || iana.includes('Brazil')) {
            return { code: 'BR', name: 'Brazil' };
        }
        if (iana.includes('Argentina')) {
            return { code: 'AR', name: 'Argentina' };
        }
        // Default to US for most America/* entries
        return { code: 'US', name: 'United States' };
    }
    
    if (region === 'Europe') {
        const europeanCountries = {
            'London': { code: 'GB', name: 'United Kingdom' },
            'Dublin': { code: 'IE', name: 'Ireland' },
            'Paris': { code: 'FR', name: 'France' },
            'Berlin': { code: 'DE', name: 'Germany' },
            'Rome': { code: 'IT', name: 'Italy' },
            'Madrid': { code: 'ES', name: 'Spain' },
            'Amsterdam': { code: 'NL', name: 'Netherlands' },
            'Vienna': { code: 'AT', name: 'Austria' },
            'Brussels': { code: 'BE', name: 'Belgium' },
            'Prague': { code: 'CZ', name: 'Czech Republic' },
            'Budapest': { code: 'HU', name: 'Hungary' },
            'Warsaw': { code: 'PL', name: 'Poland' },
            'Stockholm': { code: 'SE', name: 'Sweden' },
            'Oslo': { code: 'NO', name: 'Norway' },
            'Copenhagen': { code: 'DK', name: 'Denmark' },
            'Helsinki': { code: 'FI', name: 'Finland' },
            'Athens': { code: 'GR', name: 'Greece' },
            'Bucharest': { code: 'RO', name: 'Romania' },
            'Istanbul': { code: 'TR', name: 'Turkey' },
            'Moscow': { code: 'RU', name: 'Russia' },
            'Kiev': { code: 'UA', name: 'Ukraine' },
            'Zurich': { code: 'CH', name: 'Switzerland' }
        };
        return europeanCountries[city] || { code: '', name: '' };
    }
    
    if (region === 'Asia') {
        const asianCountries = {
            'Tokyo': { code: 'JP', name: 'Japan' },
            'Seoul': { code: 'KR', name: 'South Korea' },
            'Shanghai': { code: 'CN', name: 'China' },
            'Hong_Kong': { code: 'HK', name: 'Hong Kong' },
            'Singapore': { code: 'SG', name: 'Singapore' },
            'Bangkok': { code: 'TH', name: 'Thailand' },
            'Jakarta': { code: 'ID', name: 'Indonesia' },
            'Manila': { code: 'PH', name: 'Philippines' },
            'Taipei': { code: 'TW', name: 'Taiwan' },
            'Kolkata': { code: 'IN', name: 'India' },
            'Mumbai': { code: 'IN', name: 'India' },
            'Delhi': { code: 'IN', name: 'India' },
            'Dubai': { code: 'AE', name: 'United Arab Emirates' },
            'Riyadh': { code: 'SA', name: 'Saudi Arabia' },
            'Tehran': { code: 'IR', name: 'Iran' },
            'Colombo': { code: 'LK', name: 'Sri Lanka' } // Fix for your specific case
        };
        return asianCountries[city] || { code: '', name: '' };
    }
    
    if (region === 'Australia') {
        return { code: 'AU', name: 'Australia' };
    }
    
    if (region === 'Pacific') {
        if (city && city.includes('Auckland')) {
            return { code: 'NZ', name: 'New Zealand' };
        }
    }
    
    if (region === 'Africa') {
        const africanCountries = {
            'Cairo': { code: 'EG', name: 'Egypt' },
            'Johannesburg': { code: 'ZA', name: 'South Africa' },
            'Lagos': { code: 'NG', name: 'Nigeria' },
            'Casablanca': { code: 'MA', name: 'Morocco' },
            'Tunis': { code: 'TN', name: 'Tunisia' },
            'Algiers': { code: 'DZ', name: 'Algeria' }
        };
        return africanCountries[city] || { code: '', name: '' };
    }
    
    return { code: '', name: '' };
}

// Generate the complete dataset
const allTimezones = moment.tz.names();
console.log(`\n🔄 Processing ${allTimezones.length} timezones...`);

const enrichedData = allTimezones.map(name => {
    const zone = moment.tz.zone(name);
    const cityPart = name.split('/').pop() || name;
    const city = cityPart.replace(/_/g, ' ');
    const currentOffset = moment.tz(name).utcOffset();
    const countryInfo = getCountryInfo(name);
    
    // Get abbreviations from moment timezone data
    let abbreviations = [];
    if (zone && zone.abbrs) {
        abbreviations = [...new Set(zone.abbrs)]
            .filter(abbr => abbr && 
                     !abbr.match(/^[\+\-]/) &&  // Remove +XX:XX format
                     abbr !== 'LMT' &&          // Remove Local Mean Time
                     abbr.length <= 6 &&        // Reasonable abbreviation length
                     abbr.match(/^[A-Z]+$/))    // Only uppercase letters
            .slice(0, 8); // Allow more abbreviations
    }
    
    return {
        iana: name,
        city: city,
        countryCode: countryInfo.code,
        countryName: countryInfo.name,
        utcOffset: currentOffset,
        utcOffsetStr: moment.tz(name).format('Z'),
        abbreviations: abbreviations.join(',')
    };
});

// Remove exact duplicates and sort
const uniqueData = enrichedData.filter((item, index, arr) => 
    arr.findIndex(t => t.iana === item.iana) === index
);

// Write to file
const jsonData = JSON.stringify(uniqueData, null, 2);
const sizeKB = Buffer.byteLength(jsonData, 'utf8') / 1024;

fs.writeFileSync('data/timezone-data.json', jsonData);

console.log(`\n✅ Generated comprehensive timezone-data.json`);
console.log(`📊 Stats:
- Total timezones: ${uniqueData.length}
- File size: ${Math.round(sizeKB)} KB
- Estimated gzipped: ${Math.round(sizeKB * 0.3)} KB`);

// Quality analysis
const withCountries = uniqueData.filter(tz => tz.countryName).length;
const withAbbrevs = uniqueData.filter(tz => tz.abbreviations).length;
const mmtEntries = uniqueData.filter(tz => tz.abbreviations.includes('MMT')).length;

console.log(`\n📈 Quality metrics:
- With country names: ${withCountries}/${uniqueData.length} (${Math.round(withCountries/uniqueData.length*100)}%)
- With abbreviations: ${withAbbrevs}/${uniqueData.length} (${Math.round(withAbbrevs/uniqueData.length*100)}%)
- MMT entries found: ${mmtEntries}`);

console.log('\n🔍 Sample entries:');
const samples = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Colombo', 'Australia/Sydney'];
samples.forEach(iana => {
    const tz = uniqueData.find(t => t.iana === iana);
    if (tz) {
        console.log(`${tz.city} (${tz.countryName}): ${tz.abbreviations || 'No abbreviations'} - UTC${tz.utcOffsetStr}`);
    }
});

// Test MMT specifically
console.log('\n🎯 MMT timezone entries:');
const mmtTimezones = uniqueData.filter(tz => tz.abbreviations.includes('MMT'));
mmtTimezones.slice(0, 5).forEach(tz => {
    console.log(`- ${tz.city} (${tz.countryName || 'Unknown'}): ${tz.abbreviations}`);
});

console.log('\n✨ Data generation complete! Package is ready.');