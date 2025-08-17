-- RPG Game Database Schema
-- This file contains all the necessary SQL statements to create the complete database structure
-- Execute this file in PostgreSQL to set up the database for the RPG game application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. AUTHENTICATION TABLES
-- =====================================================

-- Users table for authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. GAME MASTER DATA TABLES
-- =====================================================

-- Character jobs table (base data)
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

-- Experience levels table (base data)
CREATE TABLE experience_levels (
  level INTEGER PRIMARY KEY,
  experience BIGINT NOT NULL
);

-- Maps table (base data)
CREATE TABLE maps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  min_level INTEGER NOT NULL DEFAULT 1,
  recommended_level INTEGER NOT NULL DEFAULT 1,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'very_hard'))
);

-- Monsters table (base data)
CREATE TABLE monsters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  map_id INTEGER NOT NULL REFERENCES maps(id)
);

-- Monster details table (rank-specific data)
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

-- Equipment table (base data)
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

-- Equipment status table (stat bonuses)
CREATE TABLE equipment_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id INTEGER NOT NULL REFERENCES equipment(id),
  health_bonus INTEGER NOT NULL DEFAULT 0,
  attack_bonus INTEGER NOT NULL DEFAULT 0,
  defense_bonus INTEGER NOT NULL DEFAULT 0,
  speed_bonus INTEGER NOT NULL DEFAULT 0,
  critical_bonus INTEGER NOT NULL DEFAULT 0
);

-- Items table (base data)
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

-- =====================================================
-- 3. USER DATA TABLES
-- =====================================================

-- Characters table (user data)
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

-- Character status table (user data)
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

-- Character equipment table (user data)
CREATE TABLE character_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id),
  equipment_id INTEGER NOT NULL REFERENCES equipment(id),
  is_equipped BOOLEAN NOT NULL DEFAULT false,
  slot VARCHAR(20) NOT NULL CHECK (slot IN ('weapon', 'armor', 'accessory1', 'accessory2')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Character inventory table (user data)
CREATE TABLE character_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id),
  item_id INTEGER NOT NULL REFERENCES items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Battle logs table (user data)
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

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

-- Character queries
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_job_id ON characters(job_id);
CREATE INDEX idx_characters_level ON characters(level);
CREATE INDEX idx_characters_name ON characters(name);

-- Character status
CREATE INDEX idx_character_statuses_character_id ON character_statuses(character_id);

-- Character equipment
CREATE INDEX idx_character_equipment_character_id ON character_equipment(character_id);
CREATE INDEX idx_character_equipment_equipment_id ON character_equipment(equipment_id);
CREATE INDEX idx_character_equipment_slot ON character_equipment(slot);
CREATE INDEX idx_character_equipment_is_equipped ON character_equipment(is_equipped);

-- Character inventory
CREATE INDEX idx_character_inventory_character_id ON character_inventory(character_id);
CREATE INDEX idx_character_inventory_item_id ON character_inventory(item_id);

-- Battle performance
CREATE INDEX idx_battle_logs_character_id ON battle_logs(character_id);
CREATE INDEX idx_battle_logs_monster_id ON battle_logs(monster_id);
CREATE INDEX idx_battle_logs_battle_date ON battle_logs(battle_date);
CREATE INDEX idx_battle_logs_battle_result ON battle_logs(battle_result);

-- Equipment queries
CREATE INDEX idx_equipment_type ON equipment(type);
CREATE INDEX idx_equipment_rarity ON equipment(rarity);
CREATE INDEX idx_equipment_min_level ON equipment(min_level);
CREATE INDEX idx_equipment_name ON equipment(name);

-- Equipment status
CREATE INDEX idx_equipment_status_equipment_id ON equipment_status(equipment_id);

-- Monster queries
CREATE INDEX idx_monsters_map_id ON monsters(map_id);
CREATE INDEX idx_monsters_name ON monsters(name);

-- Monster details
CREATE INDEX idx_monster_details_monster_id ON monster_details(monster_id);
CREATE INDEX idx_monster_details_rank ON monster_details(rank);
CREATE INDEX idx_monster_details_level ON monster_details(level);

-- Map queries
CREATE INDEX idx_maps_difficulty ON maps(difficulty);
CREATE INDEX idx_maps_min_level ON maps(min_level);
CREATE INDEX idx_maps_recommended_level ON maps(recommended_level);

-- Items
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_rarity ON items(rarity);
CREATE INDEX idx_items_name ON items(name);

-- Users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Composite indexes for common queries
CREATE INDEX idx_character_battle_stats ON characters(level, job_id);
CREATE INDEX idx_equipment_type_rarity ON equipment(type, rarity);
CREATE INDEX idx_monster_map_rank ON monsters(map_id) INCLUDE (id);

-- =====================================================
-- 5. CONSTRAINTS AND RELATIONSHIPS
-- =====================================================

-- Ensure character names are unique per user (not globally)
ALTER TABLE characters ADD CONSTRAINT unique_character_name_per_user UNIQUE (user_id, name);

-- Ensure character has only one status record
ALTER TABLE character_statuses ADD CONSTRAINT unique_character_status UNIQUE (character_id);

-- Ensure character has only one item per slot
ALTER TABLE character_equipment ADD CONSTRAINT unique_character_slot UNIQUE (character_id, slot);

-- Ensure character has only one inventory entry per item
ALTER TABLE character_inventory ADD CONSTRAINT unique_character_item UNIQUE (character_id, item_id);

-- Ensure equipment has only one status record
ALTER TABLE equipment_status ADD CONSTRAINT unique_equipment_status UNIQUE (equipment_id);

-- Ensure monster has only one detail per rank
ALTER TABLE monster_details ADD CONSTRAINT unique_monster_rank UNIQUE (monster_id, rank);

-- =====================================================
-- 6. TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_statuses_updated_at BEFORE UPDATE ON character_statuses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. INITIAL DATA SEEDING
-- =====================================================

-- Insert character jobs
INSERT INTO character_jobs (name, base_health, base_attack, base_defense, base_speed, base_critical, 
                           bonus_health_per_level, bonus_attack_per_level, bonus_defense_per_level, 
                           bonus_speed_per_level, bonus_critical_per_level) VALUES
('Barbarian', 100, 12, 17, 6, 5, 20, 1, 2, 1, 1),
('Swordsman', 100, 11, 13, 8, 8, 10, 2, 2, 1, 1),
('Archer', 100, 11, 9, 12, 8, 10, 2, 1, 2, 1),
('Ninja', 100, 8, 4, 17, 11, 10, 1, 1, 2, 2);

-- Insert experience levels (levels 1-99)
INSERT INTO experience_levels (level, experience) VALUES
(1, 0), (2, 300), (3, 750), (4, 1500), (5, 2800),
(6, 4500), (7, 7000), (8, 10500), (9, 15000), (10, 21000),
(11, 28500), (12, 37500), (13, 48000), (14, 60000), (15, 75000),
(16, 93000), (17, 114000), (18, 138000), (19, 165000), (20, 195000),
(21, 228000), (22, 264000), (23, 303000), (24, 345000), (25, 390000),
(26, 438000), (27, 489000), (28, 543000), (29, 600000), (30, 660000),
(31, 723000), (32, 789000), (33, 858000), (34, 930000), (35, 1005000),
(36, 1083000), (37, 1164000), (38, 1248000), (39, 1335000), (40, 1425000),
(41, 1518000), (42, 1614000), (43, 1713000), (44, 1815000), (45, 1920000),
(46, 2028000), (47, 2139000), (48, 2253000), (49, 2370000), (50, 2490000),
(51, 2613000), (52, 2739000), (53, 2868000), (54, 3000000), (55, 3135000),
(56, 3273000), (57, 3414000), (58, 3558000), (59, 3705000), (60, 3855000),
(61, 4008000), (62, 4164000), (63, 4323000), (64, 4485000), (65, 4650000),
(66, 4818000), (67, 4989000), (68, 5163000), (69, 5340000), (70, 5520000),
(71, 5703000), (72, 5889000), (73, 6078000), (74, 6270000), (75, 6465000),
(76, 6663000), (77, 6864000), (78, 7068000), (79, 7275000), (80, 7485000),
(81, 7698000), (82, 7914000), (83, 8133000), (84, 8355000), (85, 8580000),
(86, 8808000), (87, 9039000), (88, 9273000), (89, 9510000), (90, 9750000),
(91, 9993000), (92, 10239000), (93, 10488000), (94, 10740000), (95, 10995000),
(96, 11253000), (97, 11514000), (98, 11778000), (99, 12045000);

-- Insert sample maps
INSERT INTO maps (name, description, min_level, recommended_level, difficulty) VALUES
('Forest of Beginnings', 'A peaceful forest perfect for new adventurers', 1, 1, 'easy'),
('Dark Cave', 'A mysterious cave with stronger monsters', 5, 8, 'medium'),
('Mountain Peak', 'A challenging mountain with powerful foes', 15, 20, 'hard'),
('Abyssal Depths', 'The most dangerous area in the world', 30, 40, 'very_hard');

-- Insert sample monsters
INSERT INTO monsters (name, description, map_id) VALUES
('Wolf', 'A common forest wolf', 1),
('Goblin', 'A small green creature', 1),
('Troll', 'A large, strong monster', 2),
('Dragon', 'A legendary creature', 4);

-- Insert monster details
INSERT INTO monster_details (monster_id, rank, level, experience_reward, gold_reward, health, attack, defense, speed, critical) VALUES
(1, 'F', 1, 50, 10, 80, 8, 5, 6, 3),
(1, 'E', 3, 100, 20, 120, 12, 8, 8, 5),
(2, 'F', 2, 75, 15, 90, 10, 6, 7, 4),
(2, 'E', 4, 125, 25, 140, 14, 9, 9, 6),
(3, 'C', 8, 300, 60, 200, 18, 15, 10, 8),
(4, 'SS', 40, 5000, 1000, 1000, 80, 60, 50, 30);

-- Insert sample equipment
INSERT INTO equipment (name, type, min_level, rarity, buy_price, sell_price, drop_rate) VALUES
('Wooden Sword', 'weapon', 1, 'common', 100, 50, 0.1),
('Iron Sword', 'weapon', 5, 'uncommon', 500, 250, 0.05),
('Steel Armor', 'armor', 10, 'rare', 1000, 500, 0.02),
('Magic Ring', 'accessory', 15, 'epic', 2000, 1000, 0.01),
('Legendary Blade', 'weapon', 30, 'legendary', 10000, 5000, 0.001);

-- Insert equipment status
INSERT INTO equipment_status (equipment_id, health_bonus, attack_bonus, defense_bonus, speed_bonus, critical_bonus) VALUES
(1, 0, 5, 0, 0, 0),
(2, 0, 12, 0, 0, 2),
(3, 50, 0, 20, 0, 0),
(4, 0, 0, 0, 10, 15),
(5, 100, 50, 30, 20, 25);

-- Insert sample items
INSERT INTO items (name, type, rarity, description, buy_price, sell_price, drop_rate) VALUES
('Health Potion', 'potion', 'common', 'Restores 50 health points', 50, 25, 0.2),
('Strength Elixir', 'enhancement', 'uncommon', 'Temporarily increases attack by 10', 200, 100, 0.1),
('Magic Scroll', 'enhancement', 'rare', 'Teaches a new spell', 500, 250, 0.05);

-- =====================================================
-- 8. VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for character with complete information
CREATE VIEW character_full_info AS
SELECT 
    c.id,
    c.name,
    c.level,
    c.experience,
    c.gold,
    c.available_status_points,
    c.created_at,
    u.username as owner,
    j.name as job_name,
    cs.health,
    cs.attack,
    cs.defense,
    cs.speed,
    cs.critical
FROM characters c
JOIN users u ON c.user_id = u.id
JOIN character_jobs j ON c.job_id = j.id
JOIN character_statuses cs ON c.id = cs.character_id;

-- View for equipment with stats
CREATE VIEW equipment_with_stats AS
SELECT 
    e.id,
    e.name,
    e.type,
    e.min_level,
    e.rarity,
    e.buy_price,
    e.sell_price,
    e.drop_rate,
    es.health_bonus,
    es.attack_bonus,
    es.defense_bonus,
    es.speed_bonus,
    es.critical_bonus
FROM equipment e
LEFT JOIN equipment_status es ON e.id = es.equipment_id;

-- View for monster with details
CREATE VIEW monster_with_details AS
SELECT 
    m.id,
    m.name,
    m.description,
    m.map_id,
    mp.name as map_name,
    md.rank,
    md.level,
    md.experience_reward,
    md.gold_reward,
    md.health,
    md.attack,
    md.defense,
    md.speed,
    md.critical
FROM monsters m
JOIN maps mp ON m.map_id = mp.id
JOIN monster_details md ON m.id = md.monster_id;

-- =====================================================
-- 9. FUNCTIONS FOR GAME LOGIC
-- =====================================================

-- Function to calculate character stats based on job and level
CREATE OR REPLACE FUNCTION calculate_character_stats(
    p_job_id INTEGER,
    p_level INTEGER
) RETURNS TABLE(
    health INTEGER,
    attack INTEGER,
    defense INTEGER,
    speed INTEGER,
    critical INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.base_health + (j.bonus_health_per_level * p_level) as health,
        j.base_attack + (j.bonus_attack_per_level * p_level) as attack,
        j.base_defense + (j.bonus_defense_per_level * p_level) as defense,
        j.base_speed + (j.bonus_speed_per_level * p_level) as speed,
        j.base_critical + (j.bonus_critical_per_level * p_level) as critical
    FROM character_jobs j
    WHERE j.id = p_job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get experience required for next level
CREATE OR REPLACE FUNCTION get_experience_for_level(p_level INTEGER)
RETURNS BIGINT AS $$
DECLARE
    required_exp BIGINT;
BEGIN
    SELECT experience INTO required_exp
    FROM experience_levels
    WHERE level = p_level;
    
    RETURN COALESCE(required_exp, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to check if character can level up
CREATE OR REPLACE FUNCTION can_level_up(
    p_character_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    current_level INTEGER;
    current_exp BIGINT;
    next_level_exp BIGINT;
BEGIN
    SELECT level, experience INTO current_level, current_exp
    FROM characters
    WHERE id = p_character_id;
    
    SELECT experience INTO next_level_exp
    FROM experience_levels
    WHERE level = current_level + 1;
    
    RETURN COALESCE(next_level_exp, 0) <= current_exp;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'User accounts for authentication and game access';
COMMENT ON TABLE characters IS 'Player characters with progression data';
COMMENT ON TABLE character_jobs IS 'Base character classes with stat progression';
COMMENT ON TABLE character_statuses IS 'Current character stats and attributes';
COMMENT ON TABLE equipment IS 'Items that can be equipped for stat bonuses';
COMMENT ON TABLE equipment_status IS 'Stat bonuses provided by equipment';
COMMENT ON TABLE monsters IS 'Enemy creatures found in different maps';
COMMENT ON TABLE monster_details IS 'Rank-specific monster information and stats';
COMMENT ON TABLE maps IS 'Game locations with difficulty and level requirements';
COMMENT ON TABLE items IS 'Consumable and enhancement items';
COMMENT ON TABLE battle_logs IS 'Records of all battles fought by characters';
COMMENT ON TABLE experience_levels IS 'Experience requirements for each level';

COMMENT ON FUNCTION calculate_character_stats IS 'Calculates character stats based on job and level';
COMMENT ON FUNCTION get_experience_for_level IS 'Returns experience required for a specific level';
COMMENT ON FUNCTION can_level_up IS 'Checks if a character has enough experience to level up';

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- To verify the schema was created correctly, run:
-- \dt
-- \dv
-- \df
