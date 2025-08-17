import { EQUIPMENT_DATA } from '../../../constants/equipment';
import { EQUIPMENT_ITEMS } from '../../../constants/items';

// Test script to verify new pricing system
console.log('=== New Equipment Pricing System Test ===\n');

try {
  if (
    EQUIPMENT_DATA &&
    EQUIPMENT_DATA.length > 0 &&
    EQUIPMENT_ITEMS &&
    EQUIPMENT_ITEMS.length > 0
  ) {
    console.log(
      `✅ Successfully imported ${EQUIPMENT_DATA.length} equipment items`
    );
    console.log(
      `✅ Successfully imported ${EQUIPMENT_ITEMS.length} item entries\n`
    );

    // Test pricing by rarity
    const rarities = [
      'common',
      'uncommon',
      'rare',
      'epic',
      'legendary',
    ] as const;

    rarities.forEach((rarity) => {
      const rarityItems = EQUIPMENT_ITEMS.filter(
        (item) => item.rarity === rarity
      );

      if (rarityItems.length > 0) {
        console.log(`\n=== ${rarity.toUpperCase()} EQUIPMENT PRICING ===`);
        console.log(`Total items: ${rarityItems.length}`);

        // Sample a few items
        const samples = rarityItems.slice(0, 3);

        samples.forEach((item, index) => {
          const equipment = EQUIPMENT_DATA.find(
            (eq) => eq.id === item.parentId
          );
          if (!equipment) return;

          const totalStats =
            equipment.status.health +
            equipment.status.attack +
            equipment.status.defense +
            equipment.status.speed +
            equipment.status.critical;
          const buyPrice = item.price.buy;
          const sellPrice = item.price.sell;
          const priceRatio = buyPrice / sellPrice;

          console.log(
            `\n${index + 1}. ${item.name} (Level ${equipment.minLevel})`
          );
          console.log(`   Total Stats: ${totalStats}`);
          console.log(`   Buy Price: ${buyPrice} gold`);
          console.log(`   Sell Price: ${sellPrice} gold`);
          console.log(
            `   Buy/Sell Ratio: ${priceRatio.toFixed(2)}x (expected: ~1.5x)`
          );

          // Check if price correlates with stats
          const expectedPrice =
            Math.floor(totalStats * 0.5) +
            (rarity === 'common'
              ? 100
              : rarity === 'uncommon'
                ? 250
                : rarity === 'rare'
                  ? 600
                  : rarity === 'epic'
                    ? 1500
                    : 4000);
          const priceCorrelation = buyPrice / expectedPrice;
          console.log(
            `   Price Correlation: ${priceCorrelation.toFixed(2)}x expected (1.0 = perfect correlation)`
          );
        });

        // Calculate price statistics for this rarity
        const prices = rarityItems.map((item) => item.price.buy);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice =
          prices.reduce((sum, price) => sum + price, 0) / prices.length;

        console.log(`\n📊 ${rarity.toUpperCase()} Price Statistics:`);
        console.log(`   Min Price: ${minPrice} gold`);
        console.log(`   Max Price: ${maxPrice} gold`);
        console.log(`   Average Price: ${avgPrice.toFixed(0)} gold`);
        console.log(`   Price Range: ${maxPrice - minPrice} gold`);
      }
    });

    // Test price vs stats correlation
    console.log('\n=== PRICE VS STATS CORRELATION ===');

    const priceStatsData = EQUIPMENT_ITEMS.map((item) => {
      const equipment = EQUIPMENT_DATA.find((eq) => eq.id === item.parentId);
      if (!equipment) return null;

      return {
        name: item.name,
        rarity: item.rarity,
        totalStats:
          equipment.status.health +
          equipment.status.attack +
          equipment.status.defense +
          equipment.status.speed +
          equipment.status.critical,
        buyPrice: item.price.buy,
        sellPrice: item.price.sell,
      };
    }).filter(Boolean);

    // Sort by total stats to see if price increases with stats
    priceStatsData.sort((a, b) => a!.totalStats - b!.totalStats);

    console.log('\n📈 Price vs Stats Analysis (sorted by total stats):');
    const samples = [
      ...priceStatsData.slice(0, 5), // Lowest stats
      ...priceStatsData.slice(
        Math.floor(priceStatsData.length / 2) - 2,
        Math.floor(priceStatsData.length / 2) + 3
      ), // Middle stats
      ...priceStatsData.slice(-5), // Highest stats
    ];

    samples.forEach((item, index) => {
      if (!item) return;
      console.log(`${index + 1}. ${item.name} (${item.rarity})`);
      console.log(
        `   Stats: ${item.totalStats}, Buy: ${item.buyPrice}, Sell: ${item.sellPrice}`
      );
    });

    // Calculate overall correlation
    const totalStats = priceStatsData.map((item) => item!.totalStats);
    const buyPrices = priceStatsData.map((item) => item!.buyPrice);

    const avgStats =
      totalStats.reduce((sum, stats) => sum + stats, 0) / totalStats.length;
    const avgPrices =
      buyPrices.reduce((sum, price) => sum + price, 0) / buyPrices.length;

    let correlation = 0;
    let statsVariance = 0;
    let priceVariance = 0;
    let covariance = 0;

    for (let i = 0; i < totalStats.length; i++) {
      const statsDiff = totalStats[i] - avgStats;
      const priceDiff = buyPrices[i] - avgPrices;

      statsVariance += statsDiff * statsDiff;
      priceVariance += priceDiff * priceDiff;
      covariance += statsDiff * priceDiff;
    }

    if (statsVariance > 0 && priceVariance > 0) {
      correlation = covariance / Math.sqrt(statsVariance * priceVariance);
    }

    console.log(
      `\n📊 Overall Price-Stats Correlation: ${correlation.toFixed(3)}`
    );
    if (correlation > 0.7) {
      console.log(
        '🎉 Strong correlation! Price strongly correlates with total stats.'
      );
    } else if (correlation > 0.4) {
      console.log(
        '✅ Moderate correlation! Price moderately correlates with total stats.'
      );
    } else {
      console.log(
        "⚠️  Weak correlation! Price doesn't strongly correlate with total stats."
      );
    }
  } else {
    console.log('❌ EQUIPMENT_DATA or EQUIPMENT_ITEMS is empty or undefined');
  }
} catch (error) {
  console.log(
    '❌ Error importing equipment data:',
    error instanceof Error ? error.message : String(error)
  );
}
