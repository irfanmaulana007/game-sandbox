#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import { execSync } from 'child_process';
import type { Equipment, EquipmentType } from '../../../types/equipment';
import type { Item, ItemRarity } from '../../../types/item';
import type { CharacterStatus } from '../../../types/character';

// Equipment configuration
const EQUIPMENT_CONFIG = {
  // Attribute multipliers for each rarity
  rarityMultipliers: {
    common: { min: 1, base: 2, max: 3 }, // 2-3 (20% variance from base 2)
    uncommon: { min: 2, base: 3, max: 4 }, // 3-4 (20% variance from base 3)
    rare: { min: 3, base: 4, max: 5 }, // 4-5 (20% variance from base 4)
    epic: { min: 4, base: 5, max: 6 }, // 5-6 (20% variance from base 5)
    legendary: { min: 6, base: 8, max: 10 }, // 8-10 (20% variance from base 8)
  },
  // Price multipliers for each rarity
  priceMultipliers: {
    common: { min: 50, base: 100, max: 150 },
    uncommon: { min: 150, base: 250, max: 350 },
    rare: { min: 400, base: 600, max: 800 },
    epic: { min: 1000, base: 1500, max: 2000 },
    legendary: { min: 3000, base: 4000, max: 5000 },
  },
  // Level price scaling
  levelPriceScaling: {
    '1': 1,
    '5': 1.5,
    '10': 2.5,
    '15': 4,
    '20': 6,
    '25': 9,
    '30': 13,
    '35': 18,
    '40': 25,
  },
  // Drop rate multipliers for each rarity
  dropRateMultipliers: {
    common: { min: 0.08, base: 0.1, max: 0.12 }, // 8-12% (was 80-120%)
    uncommon: { min: 0.06, base: 0.08, max: 0.1 }, // 6-10% (was 60-100%)
    rare: { min: 0.04, base: 0.06, max: 0.08 }, // 4-8% (was 40-80%)
    epic: { min: 0.02, base: 0.04, max: 0.06 }, // 2-6% (was 20-60%)
    legendary: { min: 0.01, base: 0.02, max: 0.03 }, // 1-3% (was 10-30%)
  },
} as const;

// Equipment type configurations
const EQUIPMENT_TYPES = [
  {
    type: 'weapon' as const,
    namePrefixes: [
      'Iron',
      'Steel',
      'Mithril',
      'Adamantine',
      'Dragonbone',
      'Celestial',
      'Void',
      'Ethereal',
      'Ancient',
      'Mystic',
    ],
    nameSuffixes: [
      'Sword',
      'Axe',
      'Mace',
      'Bow',
      'Staff',
      'Wand',
      'Dagger',
      'Hammer',
      'Spear',
      'Crossbow',
    ],
    descriptionTemplates: [
      'A {rarity} {type} that enhances your combat prowess.',
      'This {rarity} {type} has been crafted with precision.',
      'A legendary {type} that has seen countless battles.',
      'The {rarity} {type} pulses with magical energy.',
      'Forged from the finest materials, this {type} is truly {rarity}.',
    ],
  },
  {
    type: 'armor' as const,
    namePrefixes: [
      'Leather',
      'Chain',
      'Plate',
      'Scale',
      'Dragonhide',
      'Celestial',
      'Void',
      'Ethereal',
      'Ancient',
      'Mystic',
    ],
    nameSuffixes: [
      'Helmet',
      'Chestplate',
      'Greaves',
      'Gauntlets',
      'Boots',
      'Shield',
      'Cuirass',
      'Pauldrons',
      'Vambraces',
      'Sabatons',
    ],
    descriptionTemplates: [
      'A {rarity} {type} that provides excellent protection.',
      'This {rarity} {type} has been reinforced with magic.',
      'A legendary {type} that has withstood the test of time.',
      'The {rarity} {type} glows with protective enchantments.',
      'Crafted by master artisans, this {type} is truly {rarity}.',
    ],
  },
  {
    type: 'accessory' as const,
    namePrefixes: [
      'Ring',
      'Amulet',
      'Bracelet',
      'Necklace',
      'Crown',
      'Tiara',
      'Belt',
      'Cloak',
      'Cape',
      'Mantle',
    ],
    nameSuffixes: [
      'of Power',
      'of Protection',
      'of Speed',
      'of Wisdom',
      'of Fortune',
      'of the Warrior',
      'of the Mage',
      'of the Archer',
      'of the Guardian',
      'of the Assassin',
    ],
    descriptionTemplates: [
      'A {rarity} {type} that enhances your abilities.',
      'This {rarity} {type} has been blessed with magic.',
      'A legendary {type} that has been passed down through generations.',
      'The {rarity} {type} radiates with mystical power.',
      'Crafted by ancient masters, this {type} is truly {rarity}.',
    ],
  },
] as const;

// Equipment levels to generate
const EQUIPMENT_LEVELS = [1, 5, 10, 15, 20, 25, 30, 35, 40] as const;

// Rarities to generate
const EQUIPMENT_RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
] as const;

class EquipmentGenerator {
  private equipmentId = 1;
  private itemId = 1;

  // Generate random character status based on rarity
  private generateRandomStatus(rarity: ItemRarity): CharacterStatus {
    const rarityConfig =
      EQUIPMENT_CONFIG.rarityMultipliers[
        rarity as keyof typeof EQUIPMENT_CONFIG.rarityMultipliers
      ];
    const totalPoints = Math.floor(
      Math.random() * (rarityConfig.max - rarityConfig.min + 1) +
        rarityConfig.min
    );

    const attributes: CharacterStatus = {
      health: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      critical: 0,
    };

    // Set maximum points per attribute (50% of total)
    const maxPointsPerAttribute = Math.floor(totalPoints * 0.5);

    // Create a more proportional distribution
    const attributeKeys = Object.keys(attributes) as Array<
      keyof CharacterStatus
    >;
    let remainingPoints = totalPoints;

    // First pass: assign minimum points to each attribute
    const minPointsPerAttribute = Math.floor(totalPoints * 0.1); // 10% minimum
    attributeKeys.forEach((key) => {
      attributes[key] = minPointsPerAttribute;
      remainingPoints -= minPointsPerAttribute;
    });

    // Second pass: distribute remaining points proportionally
    while (remainingPoints > 0) {
      const randomIndex = Math.floor(Math.random() * attributeKeys.length);
      const key = attributeKeys[randomIndex];

      // Check if this attribute can receive more points
      if (attributes[key] < maxPointsPerAttribute) {
        const pointsToAdd = Math.min(
          Math.floor(Math.random() * 3) + 1, // Add 1-3 points at a time
          remainingPoints,
          maxPointsPerAttribute - attributes[key]
        );

        attributes[key] += pointsToAdd;
        remainingPoints -= pointsToAdd;
      }

      // Prevent infinite loop if no attributes can receive more points
      if (
        remainingPoints > 0 &&
        attributeKeys.every((key) => attributes[key] >= maxPointsPerAttribute)
      ) {
        break;
      }
    }

    // Apply health multiplier (10x stronger since max health is 999 vs 99 for other stats)
    attributes.health = Math.floor(attributes.health * 10);

    return attributes;
  }

  // Generate price based on rarity, level, and total attributes
  private generatePrice(
    rarity: ItemRarity,
    level: number,
    totalAttributes: number
  ): { buy: number; sell: number } {
    const rarityConfig =
      EQUIPMENT_CONFIG.priceMultipliers[
        rarity as keyof typeof EQUIPMENT_CONFIG.priceMultipliers
      ];
    const levelMultiplier =
      EQUIPMENT_CONFIG.levelPriceScaling[
        level.toString() as keyof typeof EQUIPMENT_CONFIG.levelPriceScaling
      ] || 1;

    // Base price from rarity with randomization
    const basePrice = Math.floor(
      Math.random() * (rarityConfig.max - rarityConfig.min + 1) +
        rarityConfig.min
    );

    // Attribute bonus: stronger equipment costs more
    const attributeBonus = Math.floor(totalAttributes * 0.5);

    // Final price calculation
    const finalPrice = Math.floor(
      (basePrice + attributeBonus) * levelMultiplier
    );

    return {
      buy: Math.floor(finalPrice * 1.2), // 20% markup for buy price
      sell: Math.floor(finalPrice * 0.8), // 20% discount for sell price
    };
  }

  // Generate drop rate based on rarity
  private generateDropRate(rarity: ItemRarity): number {
    const rarityConfig =
      EQUIPMENT_CONFIG.dropRateMultipliers[
        rarity as keyof typeof EQUIPMENT_CONFIG.dropRateMultipliers
      ];
    const baseDropRate =
      Math.random() * (rarityConfig.max - rarityConfig.min) + rarityConfig.min;

    // Convert to percentage (0.1 = 10%)
    return Math.round(baseDropRate * 100) / 100;
  }

  // Generate equipment name
  private generateEquipmentName(type: EquipmentType): string {
    const typeConfig = EQUIPMENT_TYPES.find((t) => t.type === type);
    if (!typeConfig) return 'Unknown Equipment';

    const prefix =
      typeConfig.namePrefixes[
        Math.floor(Math.random() * typeConfig.namePrefixes.length)
      ];
    const suffix =
      typeConfig.nameSuffixes[
        Math.floor(Math.random() * typeConfig.nameSuffixes.length)
      ];

    return `${prefix} ${suffix}`;
  }

  // Generate equipment description
  private generateEquipmentDescription(type: EquipmentType): string {
    const typeConfig = EQUIPMENT_TYPES.find((t) => t.type === type);
    if (!typeConfig) return 'A mysterious piece of equipment.';

    const template =
      typeConfig.descriptionTemplates[
        Math.floor(Math.random() * typeConfig.descriptionTemplates.length)
      ];

    return template.replace('{rarity}', 'legendary').replace('{type}', type);
  }

  // Generate a single equipment item
  private generateEquipment(
    type: EquipmentType,
    rarity: ItemRarity,
    level: number
  ): { equipment: Equipment; item: Item } {
    const status = this.generateRandomStatus(rarity);
    const totalAttributes = Object.values(status).reduce(
      (sum, val) => sum + val,
      0
    );

    const equipment: Equipment = {
      id: this.equipmentId++,
      type,
      minLevel: level,
      status,
    };

    const item: Item = {
      id: this.itemId++,
      type: 'equipment',
      parentId: equipment.id,
      name: this.generateEquipmentName(type),
      description: this.generateEquipmentDescription(type),
      rarity,
      price: this.generatePrice(rarity, level, totalAttributes),
      dropRate: this.generateDropRate(rarity),
    };

    return { equipment, item };
  }

  // Generate all equipment for all types, rarities, and levels
  private generateAllEquipment(): {
    equipment: Equipment[];
    items: Item[];
  } {
    const equipment: Equipment[] = [];
    const items: Item[] = [];

    EQUIPMENT_TYPES.forEach((typeConfig) => {
      EQUIPMENT_LEVELS.forEach((level) => {
        EQUIPMENT_RARITIES.forEach((rarity) => {
          const { equipment: eq, item } = this.generateEquipment(
            typeConfig.type,
            rarity,
            level
          );
          equipment.push(eq);
          items.push(item);
        });
      });
    });

    return { equipment, items };
  }

  // Generate the equipment constants file
  private generateEquipmentFile(equipment: Equipment[]): void {
    const filePath = 'src/constants/equipment/index.ts';
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const content = `// Auto-generated by Equipment Generator
// Generated on: ${new Date().toISOString()}

import type { Equipment } from '../../types/equipment';

export const EQUIPMENT_DATA: Equipment[] = ${JSON.stringify(equipment, null, 2)};

// Export individual equipment items for easy access
export const WEAPONS = EQUIPMENT_DATA.filter((eq) => eq.type === 'weapon');
export const ARMOR = EQUIPMENT_DATA.filter((eq) => eq.type === 'armor');
export const ACCESSORIES = EQUIPMENT_DATA.filter(
  (eq) => eq.type === 'accessory'
);

// Export equipment by level ranges
export const EARLY_GAME_EQUIPMENT = EQUIPMENT_DATA.filter(
  (eq) => eq.minLevel <= 10
);
export const MID_GAME_EQUIPMENT = EQUIPMENT_DATA.filter(
  (eq) => eq.minLevel > 10 && eq.minLevel <= 25
);
export const LATE_GAME_EQUIPMENT = EQUIPMENT_DATA.filter(
  (eq) => eq.minLevel > 25
);

// Helper function to get equipment by level
export function getEquipmentByLevel(level: number) {
  return EQUIPMENT_DATA.filter((eq) => eq.minLevel <= level);
}

// Helper function to get equipment by level and type
export function getEquipmentByLevelAndType(
  level: number,
  type: 'weapon' | 'armor' | 'accessory'
) {
  return EQUIPMENT_DATA.filter(
    (eq) => eq.minLevel <= level && eq.type === type
  );
}
`;

    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Equipment file generated: ${process.cwd()}/${filePath}`);
  }

  // Generate the items constants file
  private generateItemsFile(items: Item[]): void {
    const filePath = 'src/constants/items/index.ts';
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const content = `// Auto-generated by Equipment Generator
// Generated on: ${new Date().toISOString()}

import type { Item } from '../../types/item';

export const ITEMS_DATA: Item[] = ${JSON.stringify(items, null, 2)};

// Export equipment items only
export const EQUIPMENT_ITEMS = ITEMS_DATA.filter((item) => item.type === 'equipment');

// Export items by rarity
export const COMMON_ITEMS = ITEMS_DATA.filter((item) => item.rarity === 'common');
export const UNCOMMON_ITEMS = ITEMS_DATA.filter((item) => item.rarity === 'uncommon');
export const RARE_ITEMS = ITEMS_DATA.filter((item) => item.rarity === 'rare');
export const EPIC_ITEMS = ITEMS_DATA.filter((item) => item.rarity === 'epic');
export const LEGENDARY_ITEMS = ITEMS_DATA.filter((item) => item.rarity === 'legendary');

// Export items by type
export const ENHANCEMENT_ITEMS = ITEMS_DATA.filter((item) => item.type === 'enhancement');
export const POTION_ITEMS = ITEMS_DATA.filter((item) => item.type === 'potion');

// Helper function to get items by rarity
export function getItemsByRarity(rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary') {
  return ITEMS_DATA.filter((item) => item.rarity === rarity);
}

// Helper function to get items by type
export function getItemsByType(type: 'equipment' | 'enhancement' | 'potion') {
  return ITEMS_DATA.filter((item) => item.type === 'equipment');
}

// Helper function to get equipment items by level
export function getEquipmentItemsByLevel(level: number) {
  return EQUIPMENT_ITEMS.filter((item) => {
    // This would need to be enhanced to check equipment level from parentId
    return true; // For now, return all equipment items
  });
}
`;

    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Items file generated: ${process.cwd()}/${filePath}`);
  }

  // Generate the config file
  private generateConfigFile(): void {
    const filePath = 'src/constants/equipment/config.ts';
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const content = `// Auto-generated by Equipment Generator
// Generated on: ${new Date().toISOString()}

export const EQUIPMENT_CONFIG = ${JSON.stringify(EQUIPMENT_CONFIG, null, 2)} as const;

// Equipment type configurations
export const EQUIPMENT_TYPES = ${JSON.stringify(EQUIPMENT_TYPES, null, 2)} as const;

// Equipment levels to generate
export const EQUIPMENT_LEVELS = ${JSON.stringify(EQUIPMENT_LEVELS, null, 2)} as const;

// Rarities to generate
export const EQUIPMENT_RARITIES = ${JSON.stringify(EQUIPMENT_RARITIES, null, 2)} as const;
`;

    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Config file generated: ${process.cwd()}/${filePath}`);
  }

  // Run the generator
  public run(): void {
    console.log('🎮 RPG Equipment & Items Generator');
    console.log('===================================\n');

    console.log('Generating equipment and items data...');
    const { equipment, items } = this.generateAllEquipment();
    console.log(`Generated ${equipment.length} equipment items`);
    console.log(`Generated ${items.length} item entries`);

    console.log('\n📁 Generating output files...');
    this.generateEquipmentFile(equipment);
    this.generateItemsFile(items);
    this.generateConfigFile();

    console.log('\n🔧 Running format and lint...');
    try {
      console.log('Running prettier format...');
      execSync('npm run format', { stdio: 'inherit' });

      console.log('Running eslint...');
      execSync('npm run lint', { stdio: 'inherit' });

      console.log('✅ Format and lint completed successfully!');
    } catch {
      console.log('⚠️  Format or lint failed, but generation completed.');
    }

    console.log('\n🎉 Generation complete!');
    console.log(`Generated ${equipment.length} equipment items.`);
    console.log(`Generated ${items.length} item entries.`);

    // Count by rarity
    const rarityCounts = items.reduce(
      (acc, item) => {
        acc[item.rarity] = (acc[item.rarity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log('\n📊 Summary:');
    Object.entries(rarityCounts).forEach(([rarity, count]) => {
      console.log(`  ${rarity.toUpperCase()}: ${count} items`);
    });

    // Count by type
    const typeCounts = items.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log('\n📊 Item Types:');
    Object.entries(typeCounts).forEach(([rarity, count]) => {
      console.log(`  ${rarity.toUpperCase()}: ${count} items`);
    });
  }
}

// Run the generator if this file is executed directly
if (import.meta.main) {
  const generator = new EquipmentGenerator();
  generator.run();
}
