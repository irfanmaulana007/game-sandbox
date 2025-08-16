#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Types based on existing codebase
interface CharacterStatus {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  critical: number;
}

interface Map {
  id: number;
  name: string;
  description: string;
  minLevel: number;
  recommendedLevel: number;
}

// Base monster model
interface Monster {
  id: number;
  mapId: number;
  name: string;
  description: string;
}

// Monster detail model
interface MonsterDetail {
  id: number;
  monsterId: number;
  rank: 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  level: number;
  experience: number;
  gold: number;
  status: CharacterStatus;
}

// Monster with ranges for display
interface MonsterWithRanges extends Monster {
  rankRanges: {
    level: { min: number; max: number };
    experience: { min: number; max: number };
    gold: { min: number; max: number };
    status: {
      health: { min: number; max: number };
      attack: { min: number; max: number };
      defense: { min: number; max: number };
      speed: { min: number; max: number };
      critical: { min: number; max: number };
    };
  };
}

// Rank system with multipliers
const RANKS = {
  SS: { name: 'Legendary', multiplier: 1.5 },
  S: { name: 'Epic', multiplier: 1.3 },
  A: { name: 'Rare', multiplier: 1.2 },
  B: { name: 'Uncommon', multiplier: 1.1 },
  C: { name: 'Common', multiplier: 1.0 },
  D: { name: 'Weak', multiplier: 0.9 },
  E: { name: 'Very Weak', multiplier: 0.8 },
  F: { name: 'Trash', multiplier: 0.7 },
} as const;

// Fantasy name generators
const MONSTER_PREFIXES = [
  'Shadow',
  'Crystal',
  'Dark',
  'Light',
  'Ancient',
  'Frost',
  'Flame',
  'Thunder',
  'Venom',
  'Iron',
  'Golden',
  'Silver',
  'Blood',
  'Soul',
  'Spirit',
  'Chaos',
  'Order',
  'Void',
  'Storm',
  'Earth',
  'Wind',
  'Water',
  'Fire',
  'Ice',
];

const MONSTER_SUFFIXES = [
  'Prowler',
  'Golem',
  'Dragon',
  'Beast',
  'Spirit',
  'Wraith',
  'Knight',
  'Mage',
  'Warrior',
  'Assassin',
  'Guardian',
  'Hunter',
  'Stalker',
  'Slayer',
  'Destroyer',
  'Protector',
  'Summoner',
  'Necromancer',
  'Paladin',
  'Berserker',
  'Ranger',
];

const MAP_PREFIXES = [
  'Whispering',
  'Crimson',
  'Shadow',
  'Crystal',
  'Dark',
  'Light',
  'Ancient',
  'Frost',
  'Flame',
  'Thunder',
  'Venom',
  'Iron',
  'Golden',
  'Silver',
  'Blood',
  'Soul',
  'Spirit',
  'Chaos',
  'Order',
  'Void',
  'Storm',
  'Earth',
  'Wind',
];

const MAP_SUFFIXES = [
  'Woods',
  'Caverns',
  'Forest',
  'Mountain',
  'Valley',
  'Desert',
  'Swamp',
  'Castle',
  'Temple',
  'Ruins',
  'Tower',
  'Dungeon',
  'Cave',
  'Lake',
  'River',
  'Island',
  'Plains',
  'Hills',
  'Peaks',
  'Gorge',
  'Marsh',
  'Wasteland',
];

const MONSTER_DESCRIPTIONS = [
  'A fearsome creature that haunts these lands.',
  'Born from ancient magic and dark forces.',
  'A corrupted being seeking vengeance.',
  'Guardian of forgotten treasures.',
  'A creature of pure destruction and chaos.',
  'Once noble, now twisted by dark magic.',
  'A legendary beast of immense power.',
  'A mysterious entity from another realm.',
  'Corrupted by the darkness of this place.',
  'A guardian of ancient secrets.',
];

const MAP_DESCRIPTIONS = [
  'A mysterious place shrouded in ancient magic.',
  'Where legends are born and heroes fall.',
  'A realm of darkness and forgotten treasures.',
  'Ancient ruins hold secrets of the past.',
  'A place where reality bends and twists.',
  'Home to creatures of legend and myth.',
  'Where the brave go to prove their worth.',
  'A land of eternal twilight and mystery.',
  'Ancient forces still linger in these halls.',
  'A place where time itself seems to stand still.',
];

class RPGGenerator {
  private rl: readline.Interface;
  private maps: Map[] = [];
  private baseMonsters: Monster[] = [];
  private monsterDetails: MonsterDetail[] = [];
  private monstersWithRanges: MonsterWithRanges[] = [];
  private nextMapId = 1;
  private nextBaseMonsterId = 1;
  private nextMonsterDetailId = 1;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private question(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, resolve);
    });
  }

  private generateRandomName(prefixes: string[], suffixes: string[]): string {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${suffix}`;
  }

  private generateRandomDescription(descriptions: string[]): string {
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private calculateMonsterLevel(
    rank: keyof typeof RANKS,
    mapMinLevel: number,
    mapRecommendedLevel: number
  ): number {
    const rankOrder = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS'];
    const rankIndex = rankOrder.indexOf(rank);

    if (rank === 'C') return mapMinLevel;
    if (rank === 'A') return mapRecommendedLevel;

    // Interpolate between min and recommended levels
    const progress = rankIndex / (rankOrder.length - 1);
    return Math.round(
      mapMinLevel + (mapRecommendedLevel - mapMinLevel) * progress
    );
  }

  private generateMonsterStats(
    level: number,
    rank: keyof typeof RANKS
  ): CharacterStatus {
    const minBasePoints = 40 + (level - 1) * 5;
    const maxBasePoints = 50 + (level - 1) * 6;
    const basePoints = Math.floor(
      minBasePoints + (maxBasePoints - minBasePoints) * Math.random()
    );
    const rankMultiplier = RANKS[rank].multiplier;

    // Base stats (will be multiplied by rank multiplier)
    const baseHealth = Math.max(1, Math.floor(basePoints * 0.2));
    const remainingPoints = basePoints - baseHealth;

    // Distribute remaining points randomly
    const attack = Math.max(1, Math.floor(remainingPoints * 0.3));
    const defense = Math.max(1, Math.floor(remainingPoints * 0.3));
    const speed = Math.max(1, Math.floor(remainingPoints * 0.2));
    const critical = Math.max(1, remainingPoints - attack - defense - speed);

    return {
      health: Math.floor(baseHealth * 10 * rankMultiplier),
      attack: Math.floor(attack * rankMultiplier),
      defense: Math.floor(defense * rankMultiplier),
      speed: Math.floor(speed * rankMultiplier),
      critical: Math.floor(critical * rankMultiplier),
    };
  }

  private calculateRewards(
    level: number,
    rank: keyof typeof RANKS
  ): { experience: number; gold: number } {
    const baseExperience = level * 100;
    const baseGold = level * 50;
    const rankMultiplier = RANKS[rank].multiplier;

    return {
      experience: Math.floor(baseExperience * rankMultiplier),
      gold: Math.floor(baseGold * rankMultiplier),
    };
  }

  private async generateMap(): Promise<Map> {
    console.log(`\n--- Generating Map ${this.nextMapId} ---`);

    const nameInput = await this.question(
      'Map name (press Enter for random): '
    );
    const name =
      nameInput.trim() || this.generateRandomName(MAP_PREFIXES, MAP_SUFFIXES);

    const descInput = await this.question(
      'Map description (press Enter for random): '
    );
    const description =
      descInput.trim() || this.generateRandomDescription(MAP_DESCRIPTIONS);

    const minLevelInput = await this.question('Minimum level (required): ');
    const minLevel = parseInt(minLevelInput);

    if (isNaN(minLevel) || minLevel < 1) {
      throw new Error('Minimum level must be a positive number');
    }

    const recommendedLevel = Math.ceil(minLevel * 1.2);

    const map: Map = {
      id: this.nextMapId,
      name,
      description,
      minLevel,
      recommendedLevel,
    };

    this.nextMapId++;
    return map;
  }

  private async generateMonstersForMap(map: Map): Promise<void> {
    const monstersPerRankInput = await this.question(
      `Monsters per rank for "${map.name}" (will generate 8 ranks × this number): `
    );
    const monstersPerRank = parseInt(monstersPerRankInput);

    if (isNaN(monstersPerRank) || monstersPerRank < 1) {
      throw new Error('Monsters per rank must be a positive number');
    }

    const totalMonsters = monstersPerRank * 8;
    console.log(
      `\nGenerating ${totalMonsters} monsters (${monstersPerRank} per rank) for map "${map.name}"...`
    );

    // Generate base monsters first
    for (let i = 0; i < monstersPerRank; i++) {
      const baseMonster: Monster = {
        id: this.nextBaseMonsterId,
        mapId: map.id,
        name: this.generateRandomName(MONSTER_PREFIXES, MONSTER_SUFFIXES),
        description: this.generateRandomDescription(MONSTER_DESCRIPTIONS),
      };

      this.baseMonsters.push(baseMonster);

      // Generate monster details for all ranks
      const rankKeys = Object.keys(RANKS) as Array<keyof typeof RANKS>;
      for (const rank of rankKeys) {
        const level = this.calculateMonsterLevel(
          rank,
          map.minLevel,
          map.recommendedLevel
        );
        const stats = this.generateMonsterStats(level, rank);
        const rewards = this.calculateRewards(level, rank);

        const monsterDetail: MonsterDetail = {
          id: this.nextMonsterDetailId,
          monsterId: baseMonster.id,
          rank,
          level,
          experience: rewards.experience,
          gold: rewards.gold,
          status: stats,
        };

        this.monsterDetails.push(monsterDetail);
        this.nextMonsterDetailId++;
      }

      this.nextBaseMonsterId++;
    }

    // Generate monsters with ranges for display
    this.generateMonstersWithRanges(map.id);

    console.log(
      `Generated ${monstersPerRank} base monsters with ${totalMonsters} rank variations for map "${map.name}"`
    );
  }

  private generateMonstersWithRanges(mapId: number): void {
    const mapBaseMonsters = this.baseMonsters.filter((m) => m.mapId === mapId);

    for (const baseMonster of mapBaseMonsters) {
      const monsterDetails = this.monsterDetails.filter(
        (d) => d.monsterId === baseMonster.id
      );

      if (monsterDetails.length === 0) continue;

      // Calculate ranges across all ranks
      const levels = monsterDetails.map((d) => d.level);
      const experiences = monsterDetails.map((d) => d.experience);
      const golds = monsterDetails.map((d) => d.gold);
      const healths = monsterDetails.map((d) => d.status.health);
      const attacks = monsterDetails.map((d) => d.status.attack);
      const defenses = monsterDetails.map((d) => d.status.defense);
      const speeds = monsterDetails.map((d) => d.status.speed);
      const criticals = monsterDetails.map((d) => d.status.critical);

      const monsterWithRanges: MonsterWithRanges = {
        ...baseMonster,
        rankRanges: {
          level: { min: Math.min(...levels), max: Math.max(...levels) },
          experience: {
            min: Math.min(...experiences),
            max: Math.max(...experiences),
          },
          gold: { min: Math.min(...golds), max: Math.max(...golds) },
          status: {
            health: { min: Math.min(...healths), max: Math.max(...healths) },
            attack: { min: Math.min(...attacks), max: Math.max(...attacks) },
            defense: { min: Math.min(...defenses), max: Math.max(...defenses) },
            speed: { min: Math.min(...speeds), max: Math.max(...speeds) },
            critical: {
              min: Math.min(...criticals),
              max: Math.max(...criticals),
            },
          },
        },
      };

      this.monstersWithRanges.push(monsterWithRanges);
    }
  }

  private generateMapFile(): void {
    const filePath = path.join(
      process.cwd(),
      'src',
      'constants',
      'map',
      'index.ts'
    );
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = `// Auto-generated by RPG Generator
// Generated on: ${new Date().toISOString()}

export interface Map {
  id: number;
  name: string;
  description: string;
  minLevel: number;
  recommendedLevel: number;
}

export const MAPS: Map[] = ${JSON.stringify(this.maps, null, 2)};

export default MAPS;
`;

    fs.writeFileSync(filePath, content);
    console.log(`✅ Map file generated: ${filePath}`);
  }

  private generateMonsterFile(): void {
    const filePath = path.join(
      process.cwd(),
      'src',
      'constants',
      'monster',
      'index.ts'
    );
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = `// Auto-generated by RPG Generator
// Generated on: ${new Date().toISOString()}

import type { CharacterStatus } from '../../types/character';
import type { Map } from '../map';

// Base monster model - displayed on map detail page
export interface Monster {
  id: number;
  mapId: Map['id'];
  name: string;
  description: string;
}

// Monster detail model - contains rank-specific information
export interface MonsterDetail {
  id: number;
  monsterId: Monster['id'];
  rank: 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  level: number;
  experience: number;
  gold: number;
  status: CharacterStatus;
}

// Monster with ranges for display purposes
export interface MonsterWithRanges extends Monster {
  rankRanges: {
    level: { min: number; max: number };
    experience: { min: number; max: number };
    gold: { min: number; max: number };
    status: {
      health: { min: number; max: number };
      attack: { min: number; max: number };
      defense: { min: number; max: number };
      speed: { min: number; max: number };
      critical: { min: number; max: number };
    };
  };
}

export const BASE_MONSTERS: Monster[] = ${JSON.stringify(this.baseMonsters, null, 2)};

export const MONSTER_DETAILS: MonsterDetail[] = ${JSON.stringify(this.monsterDetails, null, 2)};

export const MONSTERS_WITH_RANGES: MonsterWithRanges[] = ${JSON.stringify(this.monstersWithRanges, null, 2)};

export default MONSTERS_WITH_RANGES;
`;

    fs.writeFileSync(filePath, content);
    console.log(`✅ Monster file generated: ${filePath}`);
  }

  private async run(): Promise<void> {
    try {
      console.log('🎮 RPG Map & Monster Generator');
      console.log('================================\n');

      const mapCountInput = await this.question('How many maps to generate? ');
      const mapCount = parseInt(mapCountInput);

      if (isNaN(mapCount) || mapCount < 1) {
        throw new Error('Map count must be a positive number');
      }

      console.log(`\nGenerating ${mapCount} maps...\n`);

      for (let i = 0; i < mapCount; i++) {
        const map = await this.generateMap();
        this.maps.push(map);

        await this.generateMonstersForMap(map);
      }

      console.log('\n📁 Generating output files...');
      this.generateMapFile();
      this.generateMonsterFile();

      console.log('\n🔧 Running format and lint...');
      try {
        const { execSync } = await import('child_process');
        console.log('Running prettier format...');
        execSync('npm run format', { stdio: 'inherit' });
        console.log('Running eslint...');
        execSync('npm run lint', { stdio: 'inherit' });
        console.log('✅ Format and lint completed successfully!');
      } catch (error) {
        console.warn(
          '⚠️  Warning: Could not run format/lint commands:',
          error instanceof Error ? error.message : error
        );
      }

      console.log('\n🎉 Generation complete!');
      console.log(
        `Generated ${this.maps.length} maps, ${this.baseMonsters.length} base monsters, and ${this.monsterDetails.length} monster details.`
      );

      // Display summary
      console.log('\n📊 Summary:');
      this.maps.forEach((map) => {
        const mapBaseMonsters = this.baseMonsters.filter(
          (m) => m.mapId === map.id
        );
        const mapMonsterDetails = this.monsterDetails.filter((d) =>
          mapBaseMonsters.some((m) => m.id === d.monsterId)
        );
        console.log(
          `  ${map.name} (ID: ${map.id}) - Level ${map.minLevel}-${map.recommendedLevel} - ${mapBaseMonsters.length} base monsters with ${mapMonsterDetails.length} rank variations`
        );
      });
    } catch (error) {
      console.error(
        '\n❌ Error:',
        error instanceof Error ? error.message : error
      );
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  public start(): void {
    this.run();
  }
}

// Run the generator if this file is executed directly
if (import.meta.main) {
  const generator = new RPGGenerator();
  generator.start();
}

export default RPGGenerator;
