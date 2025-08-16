import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Character } from '~/store/character-store';
import useCharacterStore from '~/store/character-store';
import type { CharacterStatus } from '~/types/character';
import type { Monster } from '~/types/monster';
import { useExperience } from './useExperience';

interface useBattleProps {
  character: Character;
  monster: Monster;
}

interface BattleEntity extends CharacterStatus {
  entity: 'character' | 'monster';
  name: string;
}

const MAX_TURN = 100;
export const useBattle = ({ character, monster }: useBattleProps) => {
  const { addGold } = useCharacterStore();
  const { calculateAddExperience } = useExperience(character);

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
      attack: monster.attack,
      defense: monster.defense,
      speed: monster.speed,
      critical: monster.critical,
      health: monster.health,
      entity: 'monster' as const,
      name: monster.name,
    }),
    [
      monster.attack,
      monster.defense,
      monster.speed,
      monster.critical,
      monster.health,
      monster.name,
    ]
  );

  const [characterHealth, setCharacterHealth] = useState<number>(
    character.status.health
  );
  const [monsterHealth, setMonsterHealth] = useState<number>(monster.health);
  const [battleTurn, setBattleTurn] = useState<BattleEntity[]>([]);
  //   const [turnIndex, setTurnIndex] = useState<number>(0);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  // const [isBattleReady, setIsBattleReady] = useState<boolean>(false);

  const calculateBattleTurn = useCallback(() => {
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

    setBattleTurn(turn);
    // setIsBattleReady(true);
  }, [characterEntity, monsterEntity]);

  const handleAttack = (attacker: BattleEntity, defender: BattleEntity) => {
    const isCritical = Math.random() * 100 < attacker.critical;
    const minAttack = attacker.attack - attacker.attack * 0.3;
    const maxAttack = attacker.attack + attacker.attack * 0.3;

    const baseDamage = Math.max(
      0,
      minAttack + Math.random() * (maxAttack - minAttack)
    );
    console.log('🚀 ~ handleAttack ~ baseDamage:', baseDamage);
    const criticalDamage = isCritical ? 0.5 * baseDamage : 0;
    console.log('🚀 ~ handleAttack ~ criticalDamage:', criticalDamage);
    const finalDamage = baseDamage + criticalDamage - defender.defense / 2;
    console.log('🚀 ~ handleAttack ~ finalDamage:', finalDamage);
    return { damage: Math.round(finalDamage), isCritical };
  };

  const handleEndBattle = useCallback(
    (winner: BattleEntity) => {
      if (winner.entity === 'character') {
        calculateAddExperience(monster.experience);
        addGold(monster.gold);
      }
    },
    [calculateAddExperience, addGold, monster.experience, monster.gold]
  );

  const handleStartBattle = useCallback(() => {
    // Safety check: don't start battle if turn order is not calculated
    if (battleTurn.length === 0) {
      console.warn('Battle turn order not calculated yet');
      return;
    }

    // Clear previous battle log and reset health
    setBattleLog([]);
    setCharacterHealth(character.status.health);
    setMonsterHealth(monster.health);

    // Use local variables for battle simulation
    let currentCharacterHealth = character.status.health;
    let currentMonsterHealth = monster.health;
    const log: string[] = [];
    let winner: BattleEntity | null = null;

    for (let i = 0; i < battleTurn.length; i++) {
      const currentTurn = battleTurn[i];

      if (currentTurn.entity === 'character') {
        const { damage, isCritical } = handleAttack(
          characterEntity,
          monsterEntity
        );
        currentMonsterHealth = Math.max(0, currentMonsterHealth - damage);
        log.push(
          `${characterEntity.name} attacks ${monsterEntity.name} for ${damage} damage. ${isCritical ? 'Critical hit!' : ''} Monster Health: ${currentMonsterHealth} left.`
        );
      } else {
        const { damage, isCritical } = handleAttack(
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

        log.push(`Battle ended at turn ${i + 1}!`);
        log.push(`Character Health: ${currentCharacterHealth}`);
        log.push(`Monster Health: ${currentMonsterHealth}`);
        log.push(`The winner is ${winner.name}`);

        if (winner.entity === 'character') {
          log.push(
            `${winner.entity} wins ${monster.gold} gold and ${monster.experience} experience`
          );
          log.push(
            `experience gains from: ${character.experience} to ${character.experience + monster.experience}`
          );
        }
        break;
      }
    }

    // Update all states at once after battle simulation
    setCharacterHealth(currentCharacterHealth);
    setMonsterHealth(currentMonsterHealth);
    setBattleLog(log);

    // Handle end battle rewards separately to avoid infinite loops
    if (winner) {
      // Use setTimeout to defer the store update and break the render cycle
      setTimeout(() => {
        handleEndBattle(winner);
      }, 0);
    }
  }, [
    battleTurn,
    characterEntity,
    monsterEntity,
    character.status.health,
    monster.health,
  ]);

  useEffect(() => {
    calculateBattleTurn();
  }, [calculateBattleTurn]);

  // Remove the automatic battle start effect to prevent infinite loop
  // useEffect(() => {
  //   if (isBattleReady) {
  //     handleStartBattle();
  //   }
  // }, [isBattleReady, handleStartBattle]);

  return {
    characterHealth,
    monsterHealth,
    battleTurn,
    battleLog,
    handleStartBattle,
  };
};
