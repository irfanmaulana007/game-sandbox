import { useCallback, useMemo, useState } from 'react';
import type { Character } from '~/store/character-store';
import useCharacterStore from '~/store/character-store';
import type { CharacterStatus } from '~/types/character';
import { useExperience } from './useExperience';
import type { BattleMonster } from '~/types/monster';

interface useBattleProps {
  character: Character;
  monster: BattleMonster;
  onLevelUp?: (character: Character, previousLevel: number, previousStatus: Character['status']) => void;
}

interface BattleEntity extends CharacterStatus {
  entity: 'character' | 'monster';
  name: string;
}

interface BattleResult {
  winner: BattleEntity;
  finalCharacterHealth: number;
  finalMonsterHealth: number;
  battleLog: string[];
  turnCount: number;
}

const MAX_TURN = 100;

export const useBattle = ({ character, monster, onLevelUp }: useBattleProps) => {
  const { addGold } = useCharacterStore();
  const { calculateAddExperience } = useExperience(character, onLevelUp);

  const characterEntity: BattleEntity = useMemo(
    () => ({
      ...character.status,
      entity: 'character' as const,
      name: character.name,
    }),
    [character.status, character.name]
  );

  const monsterEntity: BattleEntity = useMemo(
    () => ({
      attack: monster.status.attack,
      defense: monster.status.defense,
      speed: monster.status.speed,
      critical: monster.status.critical,
      health: monster.status.health,
      entity: 'monster' as const,
      name: monster.name,
    }),
    [monster.status, monster.name]
  );

  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isBattleInProgress, setIsBattleInProgress] = useState(false);

  const calculateBattleTurn = useCallback((): BattleEntity[] => {
    const turn: BattleEntity[] = [];

    // Calculate total speed for both entities
    const characterSpeed = characterEntity.speed;
    const monsterSpeed = monsterEntity.speed;

    // Determine who goes first based on speed (higher speed attacks first)
    const firstAttacker =
      characterSpeed >= monsterSpeed ? characterEntity : monsterEntity;
    const secondAttacker =
      characterSpeed >= monsterSpeed ? monsterEntity : characterEntity;

    // Calculate how many times each entity can attack within MAX_TURN
    let firstAttackerTurns = 0;
    let secondAttackerTurns = 0;

    // Distribute turns based on speed ratio, ensuring we don't exceed MAX_TURN
    const totalSpeed = characterSpeed + monsterSpeed;
    if (totalSpeed > 0) {
      firstAttackerTurns = Math.ceil(
        ((firstAttacker === characterEntity ? characterSpeed : monsterSpeed) /
          totalSpeed) *
          MAX_TURN
      );
      secondAttackerTurns = MAX_TURN - firstAttackerTurns;
    }

    // Build the turn order with alternating pattern based on speed ratio
    let firstCount = 0;
    let secondCount = 0;

    for (let i = 0; i < MAX_TURN; i++) {
      // Determine if first attacker should go based on their turn allocation
      if (
        firstCount < firstAttackerTurns &&
        (secondCount >= secondAttackerTurns ||
          firstCount / firstAttackerTurns <= secondCount / secondAttackerTurns)
      ) {
        turn.push(firstAttacker);
        firstCount++;
      } else {
        turn.push(secondAttacker);
        secondCount++;
      }
    }

    return turn;
  }, [characterEntity, monsterEntity]);

  const calculateDamage = useCallback(
    (attacker: BattleEntity, defender: BattleEntity) => {
      const isCritical = Math.random() * 100 < attacker.critical;
      const minAttack = attacker.attack - attacker.attack * 0.3;
      const maxAttack = attacker.attack + attacker.attack * 0.3;

      const baseDamage = Math.max(
        0,
        minAttack + Math.random() * (maxAttack - minAttack)
      );

      const criticalDamage = isCritical ? 0.5 * baseDamage : 0;
      const finalDamage = baseDamage + criticalDamage - defender.defense / 2;

      return {
        damage: Math.round(finalDamage) > 0 ? Math.round(finalDamage) : 0,
        isCritical,
      };
    },
    []
  );

  const simulateBattle = useCallback((): BattleResult => {
    console.log('Simulating battle...');
    const battleTurn = calculateBattleTurn();

    // Initialize battle state
    let currentCharacterHealth = character.status.health;
    let currentMonsterHealth = monster.status.health;
    const log: string[] = [];
    let winner: BattleEntity | null = null;
    let turnCount = 0;

    // Add battle start log
    log.push(
      `Battle started between ${characterEntity.name} and ${monsterEntity.name}!`
    );
    log.push(
      `Character Health: ${currentCharacterHealth} | Monster Health: ${currentMonsterHealth}`
    );

    for (let i = 0; i < battleTurn.length; i++) {
      const currentTurn = battleTurn[i];
      turnCount = i + 1;

      if (currentTurn.entity === 'character') {
        const { damage, isCritical } = calculateDamage(
          characterEntity,
          monsterEntity
        );
        currentMonsterHealth = Math.max(0, currentMonsterHealth - damage);

        log.push(
          `${characterEntity.name} attacks ${monsterEntity.name} for ${damage} damage. ${isCritical ? 'Critical hit!' : ''} Monster Health: ${currentMonsterHealth} left.`
        );
      } else {
        const { damage, isCritical } = calculateDamage(
          monsterEntity,
          characterEntity
        );
        currentCharacterHealth = Math.max(0, currentCharacterHealth - damage);

        log.push(
          `${monsterEntity.name} attacks ${characterEntity.name} for ${damage} damage. ${isCritical ? 'Critical hit!' : ''} Character Health: ${currentCharacterHealth} left.`
        );
      }

      // Check if battle should end early
      if (currentCharacterHealth <= 0 || currentMonsterHealth <= 0) {
        winner = currentCharacterHealth > 0 ? characterEntity : monsterEntity;

        log.push(`Battle ended at turn ${turnCount}!`);
        log.push(`Final Character Health: ${currentCharacterHealth}`);
        log.push(`Final Monster Health: ${currentMonsterHealth}`);
        log.push(`The winner is ${winner.name}!`);

        if (winner.entity === 'character') {
          log.push(
            `${winner.name} wins ${monster.gold} gold and ${monster.experience} experience!`
          );
          log.push(
            `Gold is gained from ${character.gold} to ${character.gold + monster.gold}!`
          );
          log.push(
            `Experience is gained from ${character.experience} to ${character.experience + monster.experience}!`
          );
        }
        break;
      }
    }

    // If battle reaches max turns, determine winner by remaining health
    if (!winner) {
      winner =
        currentCharacterHealth > currentMonsterHealth
          ? characterEntity
          : monsterEntity;
      log.push(
        `Battle reached maximum turns! Winner determined by remaining health.`
      );
      log.push(`Final Character Health: ${currentCharacterHealth}`);
      log.push(`Final Monster Health: ${currentMonsterHealth}`);
      log.push(`The winner is ${winner.name}!`);
    }

    return {
      winner,
      finalCharacterHealth: currentCharacterHealth,
      finalMonsterHealth: currentMonsterHealth,
      battleLog: log,
      turnCount,
    };
  }, [
    calculateBattleTurn,
    calculateDamage,
    character,
    monster,
    characterEntity,
    monsterEntity,
  ]);

  const handleStartBattle = useCallback(() => {
    setIsBattleInProgress(true);

    try {
      // Simulate battle synchronously
      const result = simulateBattle();

      // Update battle result
      setBattleResult(result);

      // Handle rewards if character wins
      if (result.winner.entity === 'character') {
        calculateAddExperience(monster.experience);
        addGold(monster.gold);
      }
    } catch (error) {
      console.error('Battle simulation failed:', error);
      // Reset state on error
      setBattleResult(null);
    } finally {
      setIsBattleInProgress(false);
    }
  }, [
    simulateBattle,
    calculateAddExperience,
    addGold,
    monster.experience,
    monster.gold,
  ]);

  const resetBattle = useCallback(() => {
    setBattleResult(null);
    setIsBattleInProgress(false);
  }, []);

  return {
    battleResult,
    isBattleInProgress,
    handleStartBattle,
    resetBattle,
  };
};
