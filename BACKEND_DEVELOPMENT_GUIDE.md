# Backend Development Guide

This guide provides comprehensive instructions for creating backend services and maintaining the database for the RPG Game Application. Use this document when prompting AI agents to create backend services.

## 🎯 Quick Start for AI Agents

When creating backend services for this RPG game, use this prompt structure:

```
Create a backend service for an RPG game with the following specifications:

1. **Game Type**: Turn-based RPG with character progression, battle mechanics, and equipment systems
2. **Core Systems**: Characters, Equipment, Monsters, Maps, Battle, Inventory
3. **Database**: PostgreSQL with UUID primary keys and proper relationships
4. **API**: RESTful API with JWT authentication
5. **Business Logic**: Include all game mechanics from the main README.md

Reference the complete specifications in README.md for:
- Database schema (all tables with constraints)
- Business logic (battle mechanics, leveling system)
- API endpoints (complete REST API specification)
- Data models (TypeScript interfaces)
```

## 🗄️ Database Setup & Migration

### 1. Initial Database Setup

```sql
-- Create database
CREATE DATABASE rpg_game_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table (for authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Core Tables Creation

Execute the SQL from the main README.md in this order:

1. **Character Jobs** (base data)
2. **Maps** (base data)
3. **Monsters** (base data)
4. **Equipment** (base data)
5. **Items** (base data)
6. **Users** (authentication)
7. **Characters** (user data)
8. **Character Status** (user data)
9. **Character Equipment** (user data)
10. **Character Inventory** (user data)
11. **Battle Logs** (user data)

### 3. Initial Data Seeding

#### Character Jobs Data
```sql
INSERT INTO character_jobs (name, base_health, base_attack, base_defense, base_speed, base_critical, 
                           bonus_health_per_level, bonus_attack_per_level, bonus_defense_per_level, 
                           bonus_speed_per_level, bonus_critical_per_level) VALUES
('Barbarian', 100, 12, 17, 6, 5, 20, 1, 2, 1, 1),
('Swordsman', 100, 11, 13, 8, 8, 10, 2, 2, 1, 1),
('Archer', 100, 11, 9, 12, 8, 10, 2, 1, 2, 1),
('Ninja', 100, 8, 4, 17, 11, 10, 1, 1, 2, 2);
```

#### Experience Table Data
```sql
-- Create experience table
CREATE TABLE experience_levels (
  level INTEGER PRIMARY KEY,
  experience BIGINT NOT NULL
);

-- Insert experience data (from src/constants/characters/experience.ts)
INSERT INTO experience_levels (level, experience) VALUES
(1, 0), (2, 300), (3, 750), (4, 1500), (5, 2800),
(6, 4500), (7, 7000), (8, 10500), (9, 15000), (10, 21000),
-- ... continue for all 99 levels
(99, 12045000);
```

## 🚀 Backend Service Architecture

### Recommended Tech Stack

#### Node.js + Express
```bash
npm init -y
npm install express cors helmet morgan dotenv
npm install pg uuid bcryptjs jsonwebtoken
npm install -D @types/node @types/express @types/cors @types/pg @types/uuid @types/bcryptjs @types/jsonwebtoken
```

#### Alternative: Fastify
```bash
npm install fastify @fastify/cors @fastify/jwt
npm install pg uuid bcryptjs
```

#### Alternative: NestJS
```bash
npm install -g @nestjs/cli
nest new rpg-backend
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
```

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── environment.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── character.controller.ts
│   │   ├── equipment.controller.ts
│   │   ├── monster.controller.ts
│   │   ├── map.controller.ts
│   │   ├── battle.controller.ts
│   │   └── inventory.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── character.service.ts
│   │   ├── equipment.service.ts
│   │   ├── monster.service.ts
│   │   ├── map.service.ts
│   │   ├── battle.service.ts
│   │   └── inventory.service.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── character.model.ts
│   │   ├── equipment.model.ts
│   │   ├── monster.model.ts
│   │   ├── map.model.ts
│   │   └── battle.model.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── character.routes.ts
│   │   ├── equipment.routes.ts
│   │   ├── monster.routes.ts
│   │   ├── map.routes.ts
│   │   ├── battle.routes.ts
│   │   └── inventory.routes.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── validation.ts
│   │   └── game-logic.ts
│   └── app.ts
├── tests/
├── package.json
└── .env
```

## 🔐 Authentication System

### JWT Implementation
```typescript
// auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService {
  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create user in database
    const user = await this.createUser(username, email, hashedPassword);
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }

  async login(username: string, password: string) {
    const user = await this.findUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }
}
```

### Authentication Middleware
```typescript
// auth.middleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

## ⚔️ Battle System Implementation

### Battle Service
```typescript
// battle.service.ts
export class BattleService {
  async simulateBattle(characterId: string, monsterId: string): Promise<BattleResult> {
    const character = await this.getCharacterWithEquipment(characterId);
    const monster = await this.getMonster(monsterId);
    
    // Implement battle logic from useBattle.ts hook
    const battleResult = this.calculateBattle(character, monster);
    
    // Update character stats and rewards
    await this.updateCharacterAfterBattle(characterId, battleResult);
    
    // Log battle
    await this.logBattle(characterId, monsterId, battleResult);
    
    return battleResult;
  }

  private calculateBattle(character: Character, monster: Monster): BattleResult {
    // Copy battle calculation logic from src/hooks/useBattle.ts
    // This includes turn order, damage calculation, critical hits, etc.
    
    // Return battle result with:
    // - winner
    // - final health values
    // - battle log
    // - turn count
    // - rewards
  }
}
```

### Battle Logic Implementation
```typescript
// game-logic.ts
export const calculateDamage = (attacker: BattleEntity, defender: BattleEntity) => {
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

export const calculateTurnOrder = (character: Character, monster: Monster) => {
  // Implement turn order logic from useBattle.ts
  // Based on speed stats and maximum 100 turns
};
```

## 📊 Character Management

### Character Service
```typescript
// character.service.ts
export class CharacterService {
  async createCharacter(userId: string, characterData: CreateCharacterDto): Promise<Character> {
    // Validate character data
    this.validateCharacterData(characterData);
    
    // Get job information
    const job = await this.getJob(characterData.jobId);
    
    // Calculate initial stats based on job
    const initialStats = this.calculateInitialStats(job);
    
    // Create character and status
    const character = await this.createCharacterRecord(userId, characterData, initialStats);
    
    return character;
  }

  async allocateStatusPoints(characterId: string, allocation: StatusAllocation): Promise<Character> {
    const character = await this.getCharacter(characterId);
    
    // Validate allocation
    this.validateStatusAllocation(character, allocation);
    
    // Apply allocation
    const updatedStats = this.applyStatusAllocation(character.status, allocation);
    
    // Update character
    return await this.updateCharacterStats(characterId, updatedStats);
  }

  private calculateInitialStats(job: CharacterJob): CharacterStatus {
    return {
      health: job.base_health,
      attack: job.base_attack,
      defense: job.base_defense,
      speed: job.base_speed,
      critical: job.base_critical
    };
  }
}
```

### Experience & Leveling
```typescript
// character.service.ts
export class CharacterService {
  async addExperience(characterId: string, experience: number): Promise<LevelUpResult> {
    const character = await this.getCharacter(characterId);
    const newTotalExperience = character.experience + experience;
    
    // Check for level ups
    const levelUps = this.calculateLevelUps(character.level, newTotalExperience);
    
    if (levelUps.length > 0) {
      // Apply level ups
      const updatedCharacter = await this.applyLevelUps(characterId, levelUps);
      
      return {
        character: updatedCharacter,
        levelsGained: levelUps.length,
        previousLevel: character.level,
        previousStats: character.status
      };
    }
    
    // Just add experience
    await this.updateCharacterExperience(characterId, newTotalExperience);
    
    return {
      character: await this.getCharacter(characterId),
      levelsGained: 0,
      previousLevel: character.level,
      previousStats: character.status
    };
  }

  private calculateLevelUps(currentLevel: number, totalExperience: number): number[] {
    // Use experience table from constants to determine levels gained
    const levelsGained: number[] = [];
    
    for (let level = currentLevel + 1; level <= 99; level++) {
      const requiredExp = this.getExperienceForLevel(level);
      if (totalExperience >= requiredExp) {
        levelsGained.push(level);
      } else {
        break;
      }
    }
    
    return levelsGained;
  }
}
```

## 🛡️ Equipment System

### Equipment Service
```typescript
// equipment.service.ts
export class EquipmentService {
  async equipItem(characterId: string, equipmentId: string, slot: string): Promise<Character> {
    const character = await this.getCharacter(characterId);
    const equipment = await this.getEquipment(equipmentId);
    
    // Validate equipment can be equipped
    this.validateEquipmentEquip(character, equipment, slot);
    
    // Unequip current item in slot if exists
    await this.unequipSlot(characterId, slot);
    
    // Equip new item
    await this.equipToSlot(characterId, equipmentId, slot);
    
    // Recalculate character stats
    return await this.recalculateCharacterStats(characterId);
  }

  async unequipItem(characterId: string, slot: string): Promise<Character> {
    // Remove equipment from slot
    await this.unequipSlot(characterId, slot);
    
    // Recalculate character stats
    return await this.recalculateCharacterStats(characterId);
  }

  private async recalculateCharacterStats(characterId: string): Promise<Character> {
    const character = await this.getCharacterWithEquipment(characterId);
    const equippedStats = await this.calculateEquippedStats(character.equipment);
    
    // Combine base stats with equipment bonuses
    const totalStats = this.combineStats(character.baseStats, equippedStats);
    
    // Update character status
    return await this.updateCharacterStatus(characterId, totalStats);
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
// battle.service.test.ts
describe('BattleService', () => {
  describe('calculateDamage', () => {
    it('should calculate damage correctly with critical hit', () => {
      const attacker = { attack: 100, critical: 20 };
      const defender = { defense: 50 };
      
      const result = calculateDamage(attacker, defender);
      
      expect(result.damage).toBeGreaterThan(0);
      expect(typeof result.isCritical).toBe('boolean');
    });
  });

  describe('simulateBattle', () => {
    it('should complete battle within maximum turns', async () => {
      const character = createMockCharacter();
      const monster = createMockMonster();
      
      const result = await battleService.simulateBattle(character.id, monster.id);
      
      expect(result.turnCount).toBeLessThanOrEqual(100);
      expect(result.winner).toBeDefined();
    });
  });
});
```

### Integration Tests
```typescript
// character.integration.test.ts
describe('Character API Integration', () => {
  it('should create character and allocate stats', async () => {
    // Create character
    const character = await createCharacter(testUser.id, {
      name: 'TestHero',
      jobId: 1
    });
    
    // Allocate stats
    const updatedCharacter = await allocateStats(character.id, {
      health: 10,
      attack: 5
    });
    
    expect(updatedCharacter.status.health).toBe(character.status.health + 100);
    expect(updatedCharacter.status.attack).toBe(character.status.attack + 5);
  });
});
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add composite indexes for common queries
CREATE INDEX idx_character_battle_stats ON characters(level, job_id);
CREATE INDEX idx_equipment_type_rarity ON equipment(type, rarity);
CREATE INDEX idx_monster_map_rank ON monsters(map_id) INCLUDE (id);

-- Partition battle logs by date for large datasets
CREATE TABLE battle_logs_2024 PARTITION OF battle_logs
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Caching Strategy
```typescript
// cache.service.ts
export class CacheService {
  async getCharacterStats(characterId: string): Promise<CharacterStatus | null> {
    const cacheKey = `character:${characterId}:stats`;
    let stats = await this.redis.get(cacheKey);
    
    if (!stats) {
      stats = await this.database.getCharacterStats(characterId);
      if (stats) {
        await this.redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5 minutes
      }
    }
    
    return stats ? JSON.parse(stats) : null;
  }
}
```

## 🚀 Deployment

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Configuration
```env
# Production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@db:5432/rpg_game_db
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secure-production-secret
CORS_ORIGIN=https://yourdomain.com
```

## 🔍 Monitoring & Logging

### Health Checks
```typescript
// health.controller.ts
export class HealthController {
  async check(req: Request, res: Response) {
    try {
      // Check database connection
      await this.database.ping();
      
      // Check Redis connection
      await this.redis.ping();
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        error: error.message
      });
    }
  }
}
```

### Logging
```typescript
// logger.service.ts
export class LoggerService {
  logBattle(battleData: BattleLogData) {
    logger.info('Battle completed', {
      characterId: battleData.characterId,
      monsterId: battleData.monsterId,
      result: battleData.result,
      duration: battleData.duration,
      rewards: battleData.rewards
    });
  }
}
```

---

## 📋 Implementation Checklist

When implementing the backend service, ensure you have:

- [ ] **Database Schema**: All tables created with proper constraints
- [ ] **Authentication**: JWT-based user authentication
- [ ] **Character System**: CRUD operations, stat allocation, leveling
- [ ] **Equipment System**: Equip/unequip, stat calculation
- [ ] **Battle System**: Turn-based combat with all game mechanics
- [ ] **Monster System**: Monster data and battle encounters
- [ ] **Map System**: Location-based gameplay
- [ ] **Inventory System**: Item management and storage
- [ ] **API Endpoints**: Complete REST API implementation
- [ ] **Validation**: Input validation and error handling
- [ ] **Testing**: Unit and integration tests
- [ ] **Documentation**: API documentation and usage examples
- [ ] **Performance**: Database optimization and caching
- [ ] **Security**: Input sanitization and rate limiting
- [ ] **Monitoring**: Health checks and logging

Use the main README.md for complete specifications and this guide for implementation details.
