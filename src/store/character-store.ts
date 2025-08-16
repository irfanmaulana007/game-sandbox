import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CharacterJob, CharacterStatus } from '~/types/character';

export interface Character {
  name: string;
  job: CharacterJob;
  status: CharacterStatus;
  level: number;
  gold: number;
  experience: number;
  availableStatusPoints: number;
}

interface CharacterStore {
  character: Character | null;
  tempStatus: CharacterStatus | null;
  tempAvailablePoints: number;
  isAllocating: boolean;
  setCharacter: (character: Character) => void;
  addLevel: () => void;
  addExperience: (experience: number) => void;
  addGold: (gold: number) => void;
  addStatusPoint: (point: number) => void;
  startAllocation: () => void;
  cancelAllocation: () => void;
  allocateStatusPoint: (statusKey: keyof CharacterStatus, amount: number) => void;
  applyAllocation: () => void;
}

const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      character: null,
      tempStatus: null,
      tempAvailablePoints: 0,
      isAllocating: false,
      setCharacter: (character: Character) => set({ character }),
      addLevel: () =>
        set((state) => ({
          character: state.character
            ? { ...state.character, level: state.character.level + 1 }
            : null,
        })),
      addExperience: (experience: number) =>
        set((state) => ({
          character: state.character
            ? {
                ...state.character,
                experience: state.character.experience + experience,
              }
            : null,
        })),
      addGold: (gold: number) =>
        set((state) => ({
          character: state.character
            ? { ...state.character, gold: state.character.gold + gold }
            : null,
        })),
      addStatusPoint: (point: number) =>
        set((state) => ({
          character: state.character
            ? { ...state.character, availableStatusPoints: state.character.availableStatusPoints + point }
            : null,
        })),
      startAllocation: () => {
        const state = get();
        if (state.character && state.character.availableStatusPoints > 0) {
          set({
            isAllocating: true,
            tempStatus: { ...state.character.status },
            tempAvailablePoints: state.character.availableStatusPoints,
          });
        }
      },
      cancelAllocation: () => {
        set({
          isAllocating: false,
          tempStatus: null,
          tempAvailablePoints: 0,
        });
      },
      allocateStatusPoint: (statusKey: keyof CharacterStatus, amount: number) => {
        const state = get();
        if (!state.tempStatus) return;
        
        // For health, 1 status point = 10 health points
        const pointsToConsume = statusKey === 'health' ? Math.abs(amount) / 10 : Math.abs(amount);
        
        // If deallocating (negative amount), we need to check if we can deallocate
        if (amount < 0) {
          // Check if we can deallocate this amount
          const currentValue = state.tempStatus[statusKey];
          const originalValue = state.character?.status[statusKey] || 0;
          if (currentValue <= originalValue) return; // Can't deallocate below original value
        } else {
          // If allocating (positive amount), check if we have enough points
          if (state.tempAvailablePoints < pointsToConsume) return;
        }
        
        set((state) => ({
          tempStatus: state.tempStatus ? {
            ...state.tempStatus,
            [statusKey]: state.tempStatus[statusKey] + amount,
          } : null,
          tempAvailablePoints: state.tempAvailablePoints + (amount < 0 ? pointsToConsume : -pointsToConsume),
        }));
      },
      applyAllocation: () => {
        const state = get();
        if (!state.character || !state.tempStatus) return;
        
        set((state) => ({
          character: state.character ? {
            ...state.character,
            status: state.tempStatus!,
            availableStatusPoints: state.tempAvailablePoints,
          } : null,
          isAllocating: false,
          tempStatus: null,
          tempAvailablePoints: 0,
        }));
      },
    }),
    {
      name: 'character-storage', // unique name for localStorage key
      partialize: (state) => ({ character: state.character }), // only persist character data
    }
  )
);

export default useCharacterStore;
