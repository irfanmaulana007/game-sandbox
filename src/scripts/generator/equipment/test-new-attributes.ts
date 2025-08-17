import { EQUIPMENT_DATA } from '../../../constants/equipment';

// Test script to verify new attribute distribution
console.log('=== New Equipment Attribute Distribution Test ===\n');

// Group equipment by rarity
const equipmentByRarity = {
  common: EQUIPMENT_DATA.filter((eq) => eq.rarity === 'common'),
  uncommon: EQUIPMENT_DATA.filter((eq) => eq.rarity === 'uncommon'),
  rare: EQUIPMENT_DATA.filter((eq) => eq.rarity === 'rare'),
  epic: EQUIPMENT_DATA.filter((eq) => eq.rarity === 'epic'),
  legendary: EQUIPMENT_DATA.filter((eq) => eq.rarity === 'legendary'),
};

// Test attribute distribution for each rarity
Object.entries(equipmentByRarity).forEach(([rarity, equipment]) => {
  console.log(`\n=== ${rarity.toUpperCase()} EQUIPMENT ===`);
  console.log(`Total items: ${equipment.length}`);

  if (equipment.length > 0) {
    // Sample a few items
    const samples = equipment.slice(0, 3);

    samples.forEach((item, index) => {
      const totalStats =
        item.status.health +
        item.status.attack +
        item.status.defense +
        item.status.speed +
        item.status.critical;
      const maxAllowed = Math.floor(totalStats * 0.5);

      console.log(`\n${index + 1}. ${item.name} (Level ${item.minLevel})`);
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

      // Check health multiplier (should be roughly 10x other stats)
      const avgOtherStats =
        (item.status.attack +
          item.status.defense +
          item.status.speed +
          item.status.critical) /
        4;
      const healthRatio = item.status.health / avgOtherStats;
      console.log(
        `  Health Ratio: ${healthRatio.toFixed(1)}x other stats (expected: ~10x)`
      );
    });

    // Calculate average total stats for this rarity
    const avgTotalStats =
      equipment.reduce((sum, item) => {
        return (
          sum +
          (item.status.health +
            item.status.attack +
            item.status.defense +
            item.status.speed +
            item.status.critical)
        );
      }, 0) / equipment.length;

    console.log(
      `\n📊 Average total stats for ${rarity}: ${avgTotalStats.toFixed(1)}`
    );
  }
});

// Test 50% cap compliance across all equipment
console.log('\n=== 50% CAP COMPLIANCE TEST ===');

let totalItems = 0;
let compliantItems = 0;
let nonCompliantItems = 0;

EQUIPMENT_DATA.forEach((item) => {
  const totalStats =
    item.status.health +
    item.status.attack +
    item.status.defense +
    item.status.speed +
    item.status.critical;
  const maxAllowed = Math.floor(totalStats * 0.5);

  totalItems++;

  const isCompliant =
    item.status.health <= maxAllowed &&
    item.status.attack <= maxAllowed &&
    item.status.defense <= maxAllowed &&
    item.status.speed <= maxAllowed &&
    item.status.critical <= maxAllowed;

  if (isCompliant) {
    compliantItems++;
  } else {
    nonCompliantItems++;
    if (nonCompliantItems <= 5) {
      // Show first 5 violations
      console.log(
        `❌ ${item.name} (${item.rarity}) - Total: ${totalStats}, Max allowed: ${maxAllowed}`
      );
      console.log(
        `   Health: ${item.status.health}, Attack: ${item.status.attack}, Defense: ${item.status.defense}, Speed: ${item.status.speed}, Critical: ${item.status.critical}`
      );
    }
  }
});

console.log(`\n📊 50% Cap Compliance Results:`);
console.log(`  Total Equipment: ${totalItems}`);
console.log(
  `  Compliant: ${compliantItems} (${((compliantItems / totalItems) * 100).toFixed(1)}%)`
);
console.log(
  `  Non-compliant: ${nonCompliantItems} (${((nonCompliantItems / totalItems) * 100).toFixed(1)}%)`
);

if (nonCompliantItems === 0) {
  console.log('\n🎉 All equipment items comply with the 50% attribute cap!');
} else {
  console.log(`\n⚠️  ${nonCompliantItems} items exceed the 50% attribute cap.`);
}

// Test health multiplier effectiveness
console.log('\n=== HEALTH MULTIPLIER TEST ===');

const healthMultiplierTest = EQUIPMENT_DATA.slice(0, 20).map((item) => {
  const avgOtherStats =
    (item.status.attack +
      item.status.defense +
      item.status.speed +
      item.status.critical) /
    4;
  const healthRatio = item.status.health / avgOtherStats;

  return {
    name: item.name,
    rarity: item.rarity,
    health: item.status.health,
    avgOtherStats: avgOtherStats.toFixed(1),
    healthRatio: healthRatio.toFixed(1),
  };
});

console.log('\nHealth Multiplier Analysis (first 20 items):');
healthMultiplierTest.forEach((test, index) => {
  console.log(`${index + 1}. ${test.name} (${test.rarity})`);
  console.log(
    `   Health: ${test.health}, Avg Other: ${test.avgOtherStats}, Ratio: ${test.healthRatio}x`
  );
});

const avgHealthRatio =
  healthMultiplierTest.reduce(
    (sum, test) => sum + parseFloat(test.healthRatio),
    0
  ) / healthMultiplierTest.length;
console.log(
  `\n📊 Average Health Ratio: ${avgHealthRatio.toFixed(1)}x (expected: ~10x)`
);
