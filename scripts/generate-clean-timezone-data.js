// Clean timezone data generator - Pure moment-timezone data only
// No patches, no country mapping, no manual fixes
const fs = require('fs');
const path = require('path');

console.log('📦 Installing required packages...');
const { execSync } = require('child_process');
try {
    execSync('npm install --save-dev moment-timezone', { stdio: 'inherit' });
} catch (error) {
    console.error('Failed to install packages:', error.message);
    process.exit(1);
}

const moment = require('moment-timezone');

console.log('🚀 Generating clean timezone data from moment-timezone only...\n');

// Get all IANA timezone names from moment-timezone
const allTimezones = moment.tz.names();
console.log(`📊 Source data: ${allTimezones.length} IANA timezones from moment-timezone`);

console.log(`\n🔄 Processing ${allTimezones.length} timezones...`);

// Generate clean dataset - only data available from moment-timezone
const cleanData = allTimezones.map(name => {
    const zone = moment.tz.zone(name);
    const cityPart = name.split('/').pop() || name;
    const city = cityPart.replace(/_/g, ' ');
    const currentOffset = moment.tz(name).utcOffset();
    
    // Get abbreviations from moment timezone data only
    let abbreviations = [];
    if (zone && zone.abbrs) {
        abbreviations = [...new Set(zone.abbrs)]
            .filter(abbr => abbr && 
                     !abbr.match(/^[+\-]/) &&  // Remove +XX:XX format
                     abbr !== 'LMT' &&         // Remove Local Mean Time
                     abbr.length <= 6 &&       // Reasonable abbreviation length
                     abbr.match(/^[A-Z]+$/))   // Only uppercase letters
            .slice(0, 8); // Limit to 8 abbreviations
    }
    
    return {
        iana: name,
        city: city,
        countryCode: '', // Always empty - no authoritative source
        countryName: '', // Always empty - no authoritative source
        utcOffset: currentOffset,
        utcOffsetStr: moment.tz(name).format('Z'),
        abbreviations: abbreviations.join(',')
    };
});

// Remove exact duplicates (shouldn't be any, but safety check)
const uniqueData = cleanData.filter((item, index, arr) => 
    arr.findIndex(t => t.iana === item.iana) === index
);

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Write to file
const jsonData = JSON.stringify(uniqueData, null, 2);
const sizeKB = Buffer.byteLength(jsonData, 'utf8') / 1024;

fs.writeFileSync(path.join(dataDir, 'timezone-data.json'), jsonData);

console.log(`\n✅ Generated clean timezone-data.json`);
console.log(`📊 Stats:
- Total timezones: ${uniqueData.length}
- File size: ${Math.round(sizeKB)} KB
- Estimated gzipped: ${Math.round(sizeKB * 0.3)} KB`);

// Quality analysis
const withAbbrevs = uniqueData.filter(tz => tz.abbreviations).length;
const mmtEntries = uniqueData.filter(tz => tz.abbreviations.includes('MMT')).length;

console.log(`\n📈 Quality metrics:
- With country names: 0/${uniqueData.length} (0%) - Intentionally blank
- With abbreviations: ${withAbbrevs}/${uniqueData.length} (${Math.round(withAbbrevs/uniqueData.length*100)}%)
- MMT entries found: ${mmtEntries}`);

console.log('\n🔍 Sample entries:');
const samples = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Colombo', 'Australia/Sydney'];
samples.forEach(iana => {
    const tz = uniqueData.find(t => t.iana === iana);
    if (tz) {
        console.log(`${tz.city}: ${tz.abbreviations || 'No abbreviations'} - UTC${tz.utcOffsetStr}`);
    }
});

// Test MMT specifically
console.log('\n🎯 MMT timezone entries:');
const mmtTimezones = uniqueData.filter(tz => tz.abbreviations.includes('MMT'));
mmtTimezones.slice(0, 10).forEach(tz => {
    console.log(`- ${tz.city}: ${tz.abbreviations}`);
});

console.log(`\n✨ Clean data generation complete!`);
console.log(`📋 Summary:
- Used pure moment-timezone data only
- No country mapping attempted (blank by design)
- No manual patches or fixes applied  
- Maintains full IANA compatibility
- Ready for high-performance search operations`);