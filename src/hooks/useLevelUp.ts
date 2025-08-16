import { useState, useRef, useCallback } from 'react';
import type { CharacterStatus } from '~/types/character';
import type { Character } from '~/store/character-store';

interface LevelUpState {
  isVisible: boolean;
  previousLevel: number;
  previousStatus: CharacterStatus;
}

export const useLevelUp = () => {
  const [levelUpState, setLevelUpState] = useState<LevelUpState>({
    isVisible: false,
    previousLevel: 0,
    previousStatus: {
      health: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      critical: 0,
    },
  });

  // Store previous character state to compare changes
  const previousCharacterRef = useRef<Character | null>(null);

  const showLevelUp = useCallback(() => {
    if (previousCharacterRef.current) {
      const previous = previousCharacterRef.current;
      setLevelUpState({
        isVisible: true,
        previousLevel: previous.level,
        previousStatus: { ...previous.status },
      });
    }
  }, []);

  const hideLevelUp = useCallback(() => {
    setLevelUpState(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const updatePreviousCharacter = useCallback((character: Character) => {
    previousCharacterRef.current = { ...character };
  }, []);

  return {
    levelUpState,
    showLevelUp,
    hideLevelUp,
    updatePreviousCharacter,
  };
};
