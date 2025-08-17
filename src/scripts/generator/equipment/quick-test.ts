// Quick test to verify improved attribute distribution
console.log('=== Quick Attribute Distribution Test ===\n');

try {
  const { EQUIPMENT_DATA } = await import('../../../constants/equipment');

  if (EQUIPMENT_DATA && EQUIPMENT_DATA.length > 0) {
    console.log(
      `✅ Successfully imported ${EQUIPMENT_DATA.length} equipment items\n`
    );

    // Test first 10 items
    const samples = EQUIPMENT_DATA.slice(0, 10);

    samples.forEach((item, index) => {
      const stats = item.status;
      const totalStats =
        stats.health +
        stats.attack +
        stats.defense +
        stats.speed +
        stats.critical;

      console.log(`${index + 1}. ${item.name} (${item.rarity})`);
      console.log(
        `   Total: ${totalStats}, Health: ${stats.health}, Attack: ${stats.attack}, Defense: ${stats.defense}, Speed: ${stats.speed}, Critical: ${stats.critical}`
      );

      // Check if critical is disproportionately high
      const avgOtherStats =
        (stats.attack + stats.defense + stats.speed + stats.critical) / 4;
      const criticalRatio = stats.critical / avgOtherStats;

      if (criticalRatio > 2) {
        console.log(
          `   ⚠️  Critical is ${criticalRatio.toFixed(1)}x higher than average other stats`
        );
      } else {
        console.log(
          `   ✅ Critical is ${criticalRatio.toFixed(1)}x average other stats (balanced)`
        );
      }
      console.log('');
    });

    // Check overall distribution
    const allStats = EQUIPMENT_DATA.map((item) => ({
      attack: item.status.attack,
      defense: item.status.defense,
      speed: item.status.speed,
      critical: item.status.critical,
    }));

    const avgAttack =
      allStats.reduce((sum, s) => sum + s.attack, 0) / allStats.length;
    const avgDefense =
      allStats.reduce((sum, s) => sum + s.defense, 0) / allStats.length;
    const avgSpeed =
      allStats.reduce((sum, s) => sum + s.speed, 0) / allStats.length;
    const avgCritical =
      allStats.reduce((sum, s) => sum + s.critical, 0) / allStats.length;

    console.log('📊 Overall Attribute Averages (excluding health):');
    console.log(`   Attack: ${avgAttack.toFixed(2)}`);
    console.log(`   Defense: ${avgDefense.toFixed(2)}`);
    console.log(`   Speed: ${avgSpeed.toFixed(2)}`);
    console.log(`   Critical: ${avgCritical.toFixed(2)}`);

    const maxAvg = Math.max(avgAttack, avgDefense, avgSpeed, avgCritical);
    const minAvg = Math.min(avgAttack, avgDefense, avgSpeed, avgCritical);
    const ratio = maxAvg / minAvg;

    console.log(
      `\n📈 Attribute Balance Ratio: ${ratio.toFixed(2)}x (closer to 1.0 = more balanced)`
    );

    if (ratio < 1.5) {
      console.log(
        '🎉 Excellent balance! Attributes are very evenly distributed.'
      );
    } else if (ratio < 2.0) {
      console.log('✅ Good balance! Attributes are reasonably distributed.');
    } else {
      console.log(
        '⚠️  Some imbalance detected. Critical might still be too high.'
      );
    }
  } else {
    console.log('❌ EQUIPMENT_DATA is empty or undefined');
  }
} catch (error) {
  console.log(
    '❌ Error importing equipment data:',
    error instanceof Error ? error.message : String(error)
  );
}
