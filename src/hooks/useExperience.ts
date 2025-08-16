import { useCallback } from 'react';
import {
  BONUS_STATUS_POINT_PER_LEVEL,
  EXPERIENCE_TABLE,
} from '~/constants/characters/experience';
import useCharacterStore, { type Character } from '~/store/character-store';

export interface LevelUpCallback {
  (character: Character, previousLevel: number, previousStatus: Character['status']): void;
}

export const useExperience = (
  character: Character | null,
  onLevelUp?: LevelUpCallback
) => {
  const {
    addExperience,
    addLevel,
    addStatusPoint,
    addAttribute,
    setCharacter,
  } = useCharacterStore();

  const calculateExperienceToNextLevel = useCallback((level: number) => {
    const nextLevel = level + 1;
    const nextLevelData = EXPERIENCE_TABLE.find(
      (item) => item.level === nextLevel
    );
    return nextLevelData?.experience || 0;
  }, []);

  const getExperienceProgress = useCallback(() => {
    if (!character) return null;

    const currentLevel = character.level;
    const currentExperience = character.experience;

    // Check if character is at max level
    if (currentLevel >= 99) {
      return {
        currentLevel,
        currentExperience,
        experienceInCurrentLevel: 0,
        experienceNeededForNextLevel: 0,
        progressPercentage: 100,
        canLevelUp: false,
        isMaxLevel: true,
      };
    }

    // Find current level data
    const currentLevelData = EXPERIENCE_TABLE.find(
      (item) => item.level === currentLevel
    );

    // Find next level data
    const nextLevelData = EXPERIENCE_TABLE.find(
      (item) => item.level === currentLevel + 1
    );

    if (!currentLevelData || !nextLevelData) return null;

    const experienceForCurrentLevel = currentLevelData.experience;
    const experienceForNextLevel = nextLevelData.experience;
    const experienceInCurrentLevel =
      currentExperience - experienceForCurrentLevel;
    const experienceNeededForNextLevel =
      experienceForNextLevel - experienceForCurrentLevel;

    return {
      currentLevel,
      currentExperience,
      experienceInCurrentLevel,
      experienceNeededForNextLevel,
      progressPercentage:
        (experienceInCurrentLevel / experienceNeededForNextLevel) * 100,
      canLevelUp: currentExperience >= experienceForNextLevel,
      isMaxLevel: false,
    };
  }, [character]);

  const getExperienceForLevel = useCallback((level: number) => {
    const levelData = EXPERIENCE_TABLE.find((item) => item.level === level);
    return levelData?.experience || 0;
  }, []);

  const calculateAddExperience = useCallback(
    (experience: number) => {
      if (!character) return;

      const currentLevel = character.level;
      const currentExperience = character.experience;
      const newTotalExperience = currentExperience + experience;

      // Add the experience first
      addExperience(experience);

      // Check if character should level up
      let shouldLevelUp = false;
      let newLevel = currentLevel;

      // Find the highest level the character can achieve with their new experience
      for (let i = EXPERIENCE_TABLE.length - 1; i >= 0; i--) {
        const levelData = EXPERIENCE_TABLE[i];
        if (newTotalExperience >= levelData.experience) {
          if (levelData.level > currentLevel) {
            shouldLevelUp = true;
            newLevel = levelData.level;
          }
          break;
        }
      }

      // Level up if eligible
      if (shouldLevelUp) {
        // Store previous state for level up callback
        const previousLevel = currentLevel;
        const previousStatus = { ...character.status };
        
        // Calculate how many levels to add
        const levelsToAdd = newLevel - currentLevel;
        addStatusPoint(BONUS_STATUS_POINT_PER_LEVEL);
        addAttribute({
          health: character.job.bonusAttributePerLevel.health,
          attack: character.job.bonusAttributePerLevel.attack,
          defense: character.job.bonusAttributePerLevel.defense,
          speed: character.job.bonusAttributePerLevel.speed,
          critical: character.job.bonusAttributePerLevel.critical,
        });

        for (let i = 0; i < levelsToAdd; i++) {
          addLevel();
        }

        // Call level up callback if provided
        if (onLevelUp) {
          // Get the updated character from store to pass current state
          const updatedCharacter = useCharacterStore.getState().character;
          if (updatedCharacter) {
            onLevelUp(updatedCharacter, previousLevel, previousStatus);
          }
        }
      }
    },
    [character, addExperience, addLevel, addStatusPoint, addAttribute]
  );

  const resetStatusPoints = useCallback(() => {
    if (!character) return;

    setCharacter({
      ...character,
      availableStatusPoints:
        character.level * BONUS_STATUS_POINT_PER_LEVEL -
        BONUS_STATUS_POINT_PER_LEVEL,
      status: {
        health:
          character.job.baseStatus.health +
          character.job.bonusAttributePerLevel.health * character.level,
        attack:
          character.job.baseStatus.attack +
          character.job.bonusAttributePerLevel.attack * character.level,
        defense:
          character.job.baseStatus.defense +
          character.job.bonusAttributePerLevel.defense * character.level,
        speed:
          character.job.baseStatus.speed +
          character.job.bonusAttributePerLevel.speed * character.level,
        critical:
          character.job.baseStatus.critical +
          character.job.bonusAttributePerLevel.critical * character.level,
      },
    });
  }, [setCharacter, character]);

  return {
    calculateExperienceToNextLevel,
    calculateAddExperience,
    getExperienceProgress,
    getExperienceForLevel,
    resetStatusPoints,
  };
};
