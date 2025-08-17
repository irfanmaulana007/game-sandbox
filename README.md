# RPG Game Application

A comprehensive React TypeScript RPG game application built with Vite, featuring character progression, battle mechanics, equipment systems, and map exploration. This document provides detailed specifications for creating backend services and maintaining the database.

## 🎮 Game Overview

This is a turn-based RPG game where players:
- Create and customize characters with different job classes
- Battle monsters on various maps
- Collect equipment and items
- Progress through levels with experience points
- Manage character attributes and status points

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for bundling and development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **Recharts** for data visualization

### Development Tools
- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type safety

## 📊 Data Models & Database Schema

### 1. Character System

#### Character Table
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(50) NOT NULL UNIQUE,
  job_id INTEGER NOT NULL REFERENCES character_jobs(id),
  level INTEGER NOT NULL DEFAULT 1,
  experience BIGINT NOT NULL DEFAULT 0,
  gold BIGINT NOT NULL DEFAULT 0,
  available_status_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Character Status Table
```sql
CREATE TABLE character_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id),
  health INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  critical INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Character Jobs Table
```sql
CREATE TABLE character_jobs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  base_health INTEGER NOT NULL,
  base_attack INTEGER NOT NULL,
  base_defense INTEGER NOT NULL,
  base_speed INTEGER NOT NULL,
  base_critical INTEGER NOT NULL,
  bonus_health_per_level INTEGER NOT NULL,
  bonus_attack_per_level INTEGER NOT NULL,
  bonus_defense_per_level INTEGER NOT NULL,
  bonus_speed_per_level INTEGER NOT NULL,
  bonus_critical_per_level INTEGER NOT NULL
);
```

### 2. Equipment System

#### Equipment Table
```sql
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('weapon', 'armor', 'accessory')),
  min_level INTEGER NOT NULL DEFAULT 1,
  rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  buy_price INTEGER NOT NULL DEFAULT 0,
  sell_price INTEGER NOT NULL DEFAULT 0,
  drop_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0001
);
```

#### Equipment Status Table
```sql
CREATE TABLE equipment_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id INTEGER NOT NULL REFERENCES equipment(id),
  health_bonus INTEGER NOT NULL DEFAULT 0,
  attack_bonus INTEGER NOT NULL DEFAULT 0,
  defense_bonus INTEGER NOT NULL DEFAULT 0,
  speed_bonus INTEGER NOT NULL DEFAULT 0,
  critical_bonus INTEGER NOT NULL DEFAULT 0
);
```

#### Character Equipment Table
```sql
CREATE TABLE character_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id),
  equipment_id INTEGER NOT NULL REFERENCES equipment(id),
  is_equipped BOOLEAN NOT NULL DEFAULT false,
  slot VARCHAR(20) NOT NULL CHECK (slot IN ('weapon', 'armor', 'accessory1', 'accessory2')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Monster System

#### Monsters Table
```sql
CREATE TABLE monsters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  map_id INTEGER NOT NULL REFERENCES maps(id)
);
```

#### Monster Details Table
```sql
CREATE TABLE monster_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monster_id INTEGER NOT NULL REFERENCES monsters(id),
  rank VARCHAR(2) NOT NULL CHECK (rank IN ('SS', 'S', 'A', 'B', 'C', 'D', 'E', 'F')),
  level INTEGER NOT NULL,
  experience_reward INTEGER NOT NULL,
  gold_reward INTEGER NOT NULL,
  health INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  critical INTEGER NOT NULL
);
```

### 4. Map System

#### Maps Table
```sql
CREATE TABLE maps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  min_level INTEGER NOT NULL DEFAULT 1,
  recommended_level INTEGER NOT NULL DEFAULT 1,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'very_hard'))
);
```

### 5. Items & Inventory

#### Items Table
```sql
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('equipment', 'enhancement', 'potion')),
  rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  description TEXT,
  buy_price INTEGER NOT NULL DEFAULT 0,
  sell_price INTEGER NOT NULL DEFAULT 0,
  drop_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0001
);
```

#### Character Inventory Table
```sql
CREATE TABLE character_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id),
  item_id INTEGER NOT NULL REFERENCES items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Battle System

#### Battle Logs Table
```sql
CREATE TABLE battle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id),
  monster_id INTEGER NOT NULL REFERENCES monsters(id),
  battle_result VARCHAR(10) NOT NULL CHECK (battle_result IN ('victory', 'defeat')),
  character_health_remaining INTEGER NOT NULL,
  monster_health_remaining INTEGER NOT NULL,
  turns_taken INTEGER NOT NULL,
  experience_gained INTEGER NOT NULL,
  gold_gained INTEGER NOT NULL,
  battle_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Business Logic & Game Mechanics

### Experience & Leveling System

#### Experience Table (Levels 1-99)
```typescript
export const EXPERIENCE_TABLE = [
  { level: 1, experience: 0 },
  { level: 2, experience: 300 },
  { level: 3, experience: 750 },
  // ... continues to level 99 with 12,045,000 experience
];
```

#### Level Up Rules
- **Status Points**: 1 point per level gained
- **Health**: 1 status point = 10 health points
- **Other Stats**: 1 status point = 1 stat point
- **Job Bonuses**: Automatic stat increases per level based on job class

#### Job Classes & Base Stats
1. **Barbarian**: High defense, balanced stats
2. **Swordsman**: Balanced attack/defense
3. **Archer**: High speed, ranged focus
4. **Ninja**: Highest speed and critical

### Battle System

#### Turn Order Calculation
- Based on character and monster speed stats
- Higher speed attacks first
- Turn distribution proportional to speed ratio
- Maximum 100 turns per battle

#### Damage Calculation
```typescript
const calculateDamage = (attacker: BattleEntity, defender: BattleEntity) => {
  const criticalResist = defender.defense / 2;
  const isCritical = Math.random() * 100 < attacker.critical - criticalResist;
  
  // Base damage with 30% variance
  const minAttack = attacker.attack - attacker.attack * 0.3;
  const maxAttack = attacker.attack + attacker.attack * 0.3;
  const baseDamage = Math.max(0, minAttack + Math.random() * (maxAttack - minAttack));
  
  // Critical damage (50% bonus)
  const criticalDamage = isCritical ? 0.5 * baseDamage : 0;
  
  // Final damage after defense reduction
  const finalDamage = baseDamage + criticalDamage - defender.defense / 2;
  
  return {
    damage: Math.round(finalDamage) > 0 ? Math.round(finalDamage) : 0,
    isCritical
  };
};
```

#### Battle Rewards
- **Experience**: Based on monster level and rank
- **Gold**: Based on monster difficulty
- **Items**: Random drops based on drop rates

### Equipment System

#### Equipment Types
- **Weapon**: Primary attack equipment
- **Armor**: Primary defense equipment  
- **Accessory**: Secondary stat bonuses

#### Rarity System
- **Common**: Basic stats, high drop rate
- **Uncommon**: Moderate stats, medium drop rate
- **Rare**: Good stats, low drop rate
- **Epic**: Excellent stats, very low drop rate
- **Legendary**: Best stats, extremely low drop rate

## 🚀 API Endpoints Specification

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Characters
```
GET    /api/characters
POST   /api/characters
GET    /api/characters/:id
PUT    /api/characters/:id
DELETE /api/characters/:id
POST   /api/characters/:id/allocate-stats
POST   /api/characters/:id/equip/:equipmentId
POST   /api/characters/:id/unequip/:slot
```

### Equipment
```
GET    /api/equipment
POST   /api/equipment
GET    /api/equipment/:id
PUT    /api/equipment/:id
DELETE /api/equipment/:id
GET    /api/equipment/type/:type
GET    /api/equipment/rarity/:rarity
```

### Monsters
```
GET    /api/monsters
GET    /api/monsters/:id
GET    /api/monsters/map/:mapId
GET    /api/monsters/rank/:rank
```

### Maps
```
GET    /api/maps
GET    /api/maps/:id
GET    /api/maps/difficulty/:difficulty
GET    /api/maps/level/:minLevel
```

### Battle
```
POST   /api/battle/start
GET    /api/battle/:id
GET    /api/battle/character/:characterId
```

### Inventory
```
GET    /api/inventory/:characterId
POST   /api/inventory/:characterId/items
PUT    /api/inventory/:characterId/items/:itemId
DELETE /api/inventory/:characterId/items/:itemId
```

## 🗄️ Database Relationships

### One-to-Many Relationships
- User → Characters
- Character → Character Status
- Character → Character Equipment
- Character → Inventory Items
- Character → Battle Logs
- Map → Monsters
- Monster → Monster Details
- Equipment → Equipment Status

### Many-to-Many Relationships
- Characters ↔ Equipment (through character_equipment)
- Characters ↔ Items (through character_inventory)

## 📈 Performance Considerations

### Indexing Strategy
```sql
-- Character queries
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_job_id ON characters(job_id);
CREATE INDEX idx_characters_level ON characters(level);

-- Battle performance
CREATE INDEX idx_battle_logs_character_id ON battle_logs(character_id);
CREATE INDEX idx_battle_logs_battle_date ON battle_logs(battle_date);

-- Equipment queries
CREATE INDEX idx_equipment_type ON equipment(type);
CREATE INDEX idx_equipment_rarity ON equipment(rarity);
CREATE INDEX idx_equipment_min_level ON equipment(min_level);

-- Monster queries
CREATE INDEX idx_monsters_map_id ON monsters(map_id);
CREATE INDEX idx_monster_details_rank ON monster_details(rank);
```

### Caching Strategy
- **Character Data**: Cache frequently accessed character stats
- **Equipment Stats**: Cache equipment bonuses
- **Monster Data**: Cache monster information by map
- **Experience Table**: Cache level progression data

## 🔧 Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL 14+
- Redis (for caching)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd game

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/game_db
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=game_db
DATABASE_USER=username
DATABASE_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret
JWT_SECRET=your-secret-key

# Server
PORT=3000
NODE_ENV=development
```

### Available Scripts
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with initial data
npm run db:reset         # Reset database
```

## 🧪 Testing Strategy

### Unit Tests
- Character stat calculations
- Battle mechanics
- Experience and leveling logic
- Equipment stat bonuses

### Integration Tests
- API endpoint functionality
- Database operations
- Authentication flows

### Load Testing
- Battle simulation performance
- Database query performance
- Concurrent user handling

## 📚 Additional Documentation

- [Level Up System](./LEVEL_UP_SYSTEM.md) - Detailed level progression mechanics
- [Equipment Generator](./src/scripts/generator/equipment/README.md) - Equipment generation scripts
- [Map Generator](./src/scripts/generator/map/README.md) - Map generation scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This documentation is designed to be comprehensive enough for backend developers to create complete services and database schemas. All business logic, data models, and API specifications are included to ensure consistency between frontend and backend implementations.
