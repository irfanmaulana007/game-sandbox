# AI Agent Prompt Guide for RPG Backend Development

This guide provides optimized prompts for AI agents to create backend services for the RPG Game Application.

## 🎯 Quick Start Prompt

```
Create a complete backend service for an RPG game with the following specifications:

**Game Type**: Turn-based RPG with character progression, battle mechanics, and equipment systems

**Core Systems**:
- Characters (creation, leveling, stat allocation)
- Equipment (equipping, stat bonuses, rarity system)
- Monsters (battle encounters, rank system)
- Maps (location-based gameplay, difficulty levels)
- Battle (turn-based combat, damage calculation, rewards)
- Inventory (item management, storage)

**Technical Requirements**:
- Database: PostgreSQL with UUID primary keys
- API: RESTful API with JWT authentication
- Language: Node.js/TypeScript or your preferred backend language
- Include all business logic from the game mechanics

**Reference Documents**:
- README.md - Complete game specifications and API endpoints
- BACKEND_DEVELOPMENT_GUIDE.md - Implementation details and architecture
- DATABASE_SCHEMA.sql - Complete database structure

**Key Game Mechanics to Implement**:
- Turn-based battle system with speed-based turn order
- Experience and leveling system (99 levels)
- Character job classes with stat progression
- Equipment system with stat bonuses
- Monster rank system (SS, S, A, B, C, D, E, F)
- Critical hit system with defense resistance
```

## 🔧 Specific Implementation Prompts

### Database Setup
```
Create a PostgreSQL database setup script for an RPG game using the schema in DATABASE_SCHEMA.sql. Include:
- Database creation
- Table creation with all constraints
- Index creation for performance
- Initial data seeding
- Database functions for game logic
```

### Authentication System
```
Implement JWT-based authentication for an RPG game backend including:
- User registration and login
- Password hashing with bcrypt
- JWT token generation and validation
- Authentication middleware
- User management endpoints
```

### Battle System
```
Implement the battle system for an RPG game with these mechanics:
- Turn-based combat with maximum 100 turns
- Speed-based turn order calculation
- Damage calculation with 30% variance and critical hits
- Defense reduction and critical resistance
- Battle rewards (experience, gold, items)
- Battle logging and history
```

### Character System
```
Create a character management system for an RPG game including:
- Character creation with job classes
- Stat allocation system (1 point per level)
- Experience and leveling (99 levels)
- Job-based stat progression
- Character status management
- Equipment integration
```

### Equipment System
```
Implement an equipment system for an RPG game with:
- Equipment types (weapon, armor, accessory)
- Rarity system (common to legendary)
- Stat bonus calculations
- Equipping/unequipping mechanics
- Slot management (weapon, armor, accessory1, accessory2)
- Level requirements
```

## 📊 Data Model Prompts

### Character Data Structure
```
Create TypeScript interfaces and database models for RPG characters including:
- Base character information (name, job, level, experience, gold)
- Character status (health, attack, defense, speed, critical)
- Job classes with base stats and level bonuses
- Equipment integration
- Inventory management
```

### Battle Data Structure
```
Design data structures for the RPG battle system:
- Battle entities (character and monster)
- Turn order calculation
- Damage calculation results
- Battle logs and history
- Battle rewards and outcomes
```

## 🚀 API Development Prompts

### REST API Structure
```
Create a complete REST API for an RPG game with these endpoints:
- Authentication: /api/auth/register, /api/auth/login
- Characters: /api/characters (CRUD operations)
- Equipment: /api/equipment (management and equipping)
- Monsters: /api/monsters (battle encounters)
- Maps: /api/maps (location information)
- Battle: /api/battle (combat system)
- Inventory: /api/inventory (item management)

Include proper validation, error handling, and authentication middleware.
```

### API Documentation
```
Generate comprehensive API documentation for an RPG game backend including:
- Endpoint descriptions and parameters
- Request/response examples
- Authentication requirements
- Error codes and messages
- Rate limiting information
- Testing examples
```

## 🧪 Testing Prompts

### Unit Testing
```
Create unit tests for RPG game backend services:
- Battle mechanics (damage calculation, turn order)
- Character system (stat allocation, leveling)
- Equipment system (stat bonuses, equipping)
- Authentication system
- Database operations
```

### Integration Testing
```
Develop integration tests for RPG game backend:
- API endpoint functionality
- Database operations and relationships
- Authentication flows
- Battle system integration
- Equipment and inventory management
```

## 📈 Performance Optimization Prompts

### Database Optimization
```
Optimize PostgreSQL database for RPG game performance:
- Index strategy for common queries
- Query optimization for battle system
- Partitioning for battle logs
- Connection pooling
- Caching strategies
```

### API Performance
```
Optimize RPG game API performance:
- Response caching
- Database query optimization
- Rate limiting
- Load balancing considerations
- Monitoring and metrics
```

## 🚀 Deployment Prompts

### Docker Setup
```
Create Docker configuration for RPG game backend:
- Multi-stage Dockerfile
- Docker Compose for development
- Environment configuration
- Health checks
- Production optimization
```

### Environment Configuration
```
Set up environment configuration for RPG game backend:
- Development vs production settings
- Database connection management
- JWT secret management
- CORS configuration
- Logging configuration
```

## 📋 Implementation Checklist Prompt

```
Create an implementation checklist for RPG game backend development:
- Database schema setup
- Authentication system
- Core game systems (characters, equipment, monsters, maps)
- Battle system implementation
- API endpoints
- Testing strategy
- Performance optimization
- Deployment configuration
- Documentation
- Monitoring and logging
```

## 🔍 Troubleshooting Prompts

### Common Issues
```
Help troubleshoot common RPG game backend issues:
- Database connection problems
- Authentication token issues
- Battle system bugs
- Performance bottlenecks
- Data consistency problems
```

### Debugging
```
Provide debugging strategies for RPG game backend:
- Logging best practices
- Error handling patterns
- Database query debugging
- API response debugging
- Performance profiling
```

---

## 💡 Tips for AI Agents

1. **Always reference the main README.md** for complete specifications
2. **Use the database schema** from DATABASE_SCHEMA.sql for data modeling
3. **Follow the architecture** outlined in BACKEND_DEVELOPMENT_GUIDE.md
4. **Implement all business logic** from the game mechanics
5. **Include proper error handling** and validation
6. **Consider performance** and scalability
7. **Provide comprehensive testing** strategies
8. **Include deployment** and monitoring instructions

## 📚 Document References

- **README.md** - Complete game specifications and API endpoints
- **BACKEND_DEVELOPMENT_GUIDE.md** - Implementation details and architecture
- **DATABASE_SCHEMA.sql** - Complete database structure with functions
- **LEVEL_UP_SYSTEM.md** - Level progression mechanics
- **AI_AGENT_PROMPT_GUIDE.md** - This guide for AI agents

Use these documents together to create a comprehensive and consistent backend service for the RPG game application.
