# Equipment Generator

This script generates comprehensive equipment data for a game with different levels, rarities, and types, and creates constant files that can be imported directly into your application.

## Features

- **Level-based Generation**: Generates equipment for levels 1, 5, 10, 15, 20, 25, 30, 35, 40
- **Rarity System**: 5 rarity levels (common, uncommon, rare, epic, legendary)
- **Equipment Types**: 3 types (weapon, armor, accessory)
- **Configurable Attributes**: Easy to adjust base attribute values for each rarity
- **Smart Pricing**: Buy prices are always higher than sell prices, scaled by level and rarity
- **Random Distribution**: Attributes are randomly distributed across health, attack, defense, speed, and critical
- **Constant File Generation**: Automatically creates TypeScript constant files for easy import

## Configuration

### Rarity Multipliers

```typescript
rarityMultipliers: {
  common: 5,      // Base attribute value: 25 total points
  uncommon: 7,    // Base attribute value: 35 total points
  rare: 10,       // Base attribute value: 50 total points
  epic: 15,       // Base attribute value: 75 total points
  legendary: 25   // Base attribute value: 125 total points
}
```

### Price Multipliers

```typescript
priceMultipliers: {
  common: { buy: 100, sell: 50 },
  uncommon: { buy: 250, sell: 125 },
  rare: { buy: 600, sell: 300 },
  epic: { buy: 1500, sell: 750 },
  legendary: { buy: 4000, sell: 2000 }
}
```

### Level Price Scaling

```typescript
levelPriceScaling: {
  1: 1,    // Base price
  5: 1.5,  // 50% more expensive
  10: 2.5, // 150% more expensive
  15: 4,   // 300% more expensive
  20: 6,   // 500% more expensive
  25: 9,   // 800% more expensive
  30: 13,  // 1200% more expensive
  35: 18,  // 1700% more expensive
  40: 25   // 2400% more expensive
}
```

## Usage

### Generate Equipment Data

#### Option 1: Interactive Generation

```bash
npm run generate:equipment
```

#### Option 2: Auto-generation

```bash
npm run auto-generate:equipment
```

### Import Generated Data

After running the generator, you can import the equipment data directly:

```typescript
// Import all equipment data
import { EQUIPMENT_DATA } from './src/constants/equipment';

// Import by type
import { WEAPONS, ARMOR, ACCESSORIES } from './src/constants/equipment';

// Import by rarity
import {
  COMMON_EQUIPMENT,
  LEGENDARY_EQUIPMENT,
} from './src/constants/equipment';

// Import by level range
import {
  EARLY_GAME_EQUIPMENT,
  MID_GAME_EQUIPMENT,
  LATE_GAME_EQUIPMENT,
} from './src/constants/equipment';

// Import helper functions
import {
  getEquipmentByLevel,
  getEquipmentByLevelAndRarity,
} from './src/constants/equipment';

// Import configuration
import {
  EQUIPMENT_CONFIG,
  EQUIPMENT_TYPES,
  EQUIPMENT_NAMES,
} from './src/constants/equipment/config';
```

### Helper Functions

```typescript
// Get equipment available for a specific character level
const level15Equipment = getEquipmentByLevel(15);

// Get equipment by level and rarity
const legendaryLevel20Equipment = getEquipmentByLevelAndRarity(20, 'legendary');

// Get equipment by level and type
const weaponsForLevel25 = getEquipmentByLevelAndType(25, 'weapon');
```

## Generated Files

The generator creates two main files:

### 1. `src/constants/equipment/index.ts`

Contains all equipment data and helper functions:

- `EQUIPMENT_DATA`: Array of all 405 equipment items
- `WEAPONS`, `ARMOR`, `ACCESSORIES`: Filtered by type
- `COMMON_EQUIPMENT`, `UNCOMMON_EQUIPMENT`, etc.: Filtered by rarity
- `EARLY_GAME_EQUIPMENT`, `MID_GAME_EQUIPMENT`, `LATE_GAME_EQUIPMENT`: Filtered by level range
- Helper functions for filtering and querying

### 2. `src/constants/equipment/config.ts`

Contains configuration data:

- `EQUIPMENT_CONFIG`: Rarity multipliers, price multipliers, and level scaling
- `EQUIPMENT_TYPES`: Type configurations with name prefixes and description templates
- `EQUIPMENT_NAMES`: Available names for each equipment type

## Output Structure

Each equipment item contains:

- **id**: Unique identifier
- **name**: Generated name (e.g., "Steel Sword", "Mystic Ring of Power")
- **description**: Flavor text describing the equipment
- **type**: Equipment type (weapon/armor/accessory)
- **minLevel**: Required level to use
- **rarity**: Equipment rarity
- **status**: Character status bonuses (randomly distributed)
- **price**: Buy and sell prices

## Example Output

```typescript
{
  id: 1,
  name: "Iron Sword",
  description: "A common weapon that enhances your combat prowess.",
  type: "weapon",
  minLevel: 1,
  rarity: "common",
  status: {
    health: 3,
    attack: 8,
    defense: 2,
    speed: 4,
    critical: 8
  },
  price: {
    buy: 100,
    sell: 50
  }
}
```

## Customization

To adjust the equipment generation:

1. **Modify rarity multipliers** in `EQUIPMENT_CONFIG.rarityMultipliers`
2. **Adjust price multipliers** in `EQUIPMENT_CONFIG.priceMultipliers`
3. **Change level scaling** in `EQUIPMENT_CONFIG.levelPriceScaling`
4. **Add new equipment names** in `EQUIPMENT_NAMES`
5. **Modify name prefixes** in `EQUIPMENT_TYPES`
6. **Update description templates** in `EQUIPMENT_TYPES`

After making changes, run the generator again to update the constant files.

## Testing

Run the test script to see sample output:

```bash
npx tsx src/scripts/generator/equipment/test-generator.ts
```

This will generate sample equipment and show statistics about the generation process.

## Integration

The generated equipment data is automatically available in your application through the constants files. You can use it in:

- **Character equipment systems**
- **Shop inventories**
- **Loot tables**
- **Equipment progression guides**
- **Crafting systems**

## Scripts

- `npm run generate:equipment` - Interactive equipment generation
- `npm run auto-generate:equipment` - Automated equipment generation
- `npm run generate` - Generate maps and monsters (existing)
- `npm run auto-generate` - Auto-generate maps and monsters (existing)
