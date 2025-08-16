# RPG Map & Monster Generator

A command-line script generator for creating balanced monster and map data for the web-based RPG game.

## Features

- **Map Generation**: Create maps with configurable parameters and automatic level calculations
- **Monster Generation**: Generate balanced monsters across 8 ranks (SS, S, A, B, C, D, E, F)
- **Complete Rank Coverage**: Each map generates monsters for ALL 8 ranks automatically
- **Stat Balancing**: Automatic stat distribution with rank-based multipliers
- **Fantasy Names**: Random generation of engaging fantasy names and descriptions
- **TypeScript Output**: Generates properly formatted `.ts` constant files
- **Auto-formatting**: Automatically runs prettier and eslint after generation

## Usage

### Run the Generator

```bash
npm run generate
```

### Interactive Prompts

The generator will prompt you for:

1. **Number of maps** to generate
2. For each map:
   - Map name (optional - generates random if empty)
   - Map description (optional - generates random if empty)
   - Minimum level (required)
   - **Monsters per rank** (required - will generate 8 ranks × this number)

## Rank System

Monsters are generated across 8 ranks with different multipliers:

| Rank | Name      | Multiplier | Description            |
| ---- | --------- | ---------- | ---------------------- |
| SS   | Legendary | 3.0x       | Highest tier monsters  |
| S    | Epic      | 2.5x       | Very powerful monsters |
| A    | Rare      | 2.0x       | Strong monsters        |
| B    | Uncommon  | 1.5x       | Above average monsters |
| C    | Common    | 1.0x       | Base tier monsters     |
| D    | Weak      | 0.8x       | Below average monsters |
| E    | Very Weak | 0.6x       | Weak monsters          |
| F    | Trash     | 0.4x       | Lowest tier monsters   |

## Stat Calculation

### Base Stats (Level 1, C Rank)

- **Total Attribute Points**: 40
- **Health**: Base health × 10
- **Attack/Defense/Speed/Critical**: Distributed from remaining points

### Level Scaling

- Each level adds +1 to total attribute points
- Health always multiplies base by 10

### Rank Multipliers

Applied to all stats, experience rewards, and gold rewards

### Experience & Gold

- **Base Experience (C Rank)**: `level * 10`
- **Base Gold (C Rank)**: `level * 5`
- **Final values**: Base × rank multiplier

## Output Files

The generator creates two files:

- `src/constants/map/index.ts` - Map data
- `src/constants/monster/index.ts` - Monster data

## Post-Generation

After generating the files, the script automatically:

1. Runs `npm run format` to apply prettier formatting
2. Runs `npm run lint` to check for any linting issues
3. Provides a summary of generated content

## Example Output

```typescript
// Generated Map
{
  id: 1,
  name: "Whispering Woods",
  description: "A mysterious place shrouded in ancient magic.",
  minLevel: 5,
  recommendedLevel: 6
}

// Generated Monster (one example per rank)
{
  id: 1,
  mapId: 1,
  rank: "SS", // Legendary tier
  name: "Shadow Dragon",
  description: "A legendary beast of immense power.",
  level: 6,
  experience: 180, // 6 * 10 * 3.0 (SS multiplier)
  gold: 90,       // 6 * 5 * 3.0 (SS multiplier)
  health: 900,    // Base health * 10 * rank multiplier
  attack: 84,     // Base attack * rank multiplier
  defense: 60,    // Base defense * rank multiplier
  speed: 42,      // Base speed * rank multiplier
  critical: 30    // Base critical * rank multiplier
}
```

## Generation Example

If you specify **3 monsters per rank** for a map:

- **Total monsters generated**: 3 × 8 = **24 monsters**
- **Distribution**: 3 SS, 3 S, 3 A, 3 B, 3 C, 3 D, 3 E, 3 F
- **Balanced coverage**: Every rank is represented equally

## Requirements

- Node.js 16+
- TypeScript
- `tsx` package (installed as dev dependency)

## Script Location

`src/scripts/generator/map/index.ts`
