// Simple test to verify equipment attributes
console.log('=== Simple Equipment Attribute Test ===\n');

// Check if we can access the equipment data
try {
  // Try to import the equipment data
  const { EQUIPMENT_DATA } = await import('../../../constants/equipment');

  if (EQUIPMENT_DATA && EQUIPMENT_DATA.length > 0) {
    console.log(
      `✅ Successfully imported ${EQUIPMENT_DATA.length} equipment items`
    );

    // Check first few items
    const samples = EQUIPMENT_DATA.slice(0, 5);

    samples.forEach((item, index) => {
      const totalStats =
        item.status.health +
        item.status.attack +
        item.status.defense +
        item.status.speed +
        item.status.critical;
      const maxAllowed = Math.floor(totalStats * 0.5);

      console.log(`\n${index + 1}. ${item.name} (${item.rarity})`);
      console.log(`  Total Stats: ${totalStats}`);
      console.log(`  Max Allowed per Attribute: ${maxAllowed}`);
      console.log(
        `  Health: ${item.status.health} ${item.status.health > maxAllowed ? '❌ EXCEEDS 50%' : '✅ OK'}`
      );
      console.log(
        `  Attack: ${item.status.attack} ${item.status.attack > maxAllowed ? '❌ EXCEEDS 50%' : '✅ OK'}`
      );
      console.log(
        `  Defense: ${item.status.defense} ${item.status.defense > maxAllowed ? '❌ EXCEEDS 50%' : '✅ OK'}`
      );
      console.log(
        `  Speed: ${item.status.speed} ${item.status.speed > maxAllowed ? '❌ EXCEEDS 50%' : '✅ OK'}`
      );
      console.log(
        `  Critical: ${item.status.critical} ${item.status.critical > maxAllowed ? '❌ EXCEEDS 50%' : '✅ OK'}`
      );
    });

    // Check rarity distribution
    const rarityCounts: Record<string, number> = {};
    EQUIPMENT_DATA.forEach((item) => {
      rarityCounts[item.rarity] = (rarityCounts[item.rarity] || 0) + 1;
    });

    console.log('\n📊 Rarity Distribution:');
    Object.entries(rarityCounts).forEach(([rarity, count]) => {
      console.log(`  ${rarity}: ${count} items`);
    });
  } else {
    console.log('❌ EQUIPMENT_DATA is empty or undefined');
  }
} catch (error) {
  console.log(
    '❌ Error importing equipment data:',
    error instanceof Error ? error.message : String(error)
  );

  // Try alternative approach - check file directly
  console.log('\n🔍 Trying alternative approach...');

  try {
    const fs = await import('fs');
    const path = await import('path');

    const filePath = path.join(
      process.cwd(),
      'src',
      'constants',
      'equipment',
      'index.ts'
    );
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Count equipment items by looking for "id:" patterns
    const idMatches = fileContent.match(/id:\s*\d+/g);
    if (idMatches) {
      console.log(`📁 Found ${idMatches.length} equipment items in file`);

      // Extract a sample item
      const sampleMatch = fileContent.match(/id:\s*1[^}]+}/s);
      if (sampleMatch) {
        console.log('\n📋 Sample item structure:');
        console.log(sampleMatch[0].substring(0, 200) + '...');
      }
    }
  } catch (fsError) {
    console.log(
      '❌ Could not read file directly:',
      fsError instanceof Error ? fsError.message : String(fsError)
    );
  }
}
