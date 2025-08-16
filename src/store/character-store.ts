import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CharacterJob, CharacterStatus } from '~/types/character';

interface Character {
  name: string;
  job: CharacterJob;
  status: CharacterStatus;
  level: number;
  experience: number;
  availableStatusPoints: number;
}

interface CharacterStore {
  character: Character | null;
  setCharacter: (character: Character) => void;
  addLevel: () => void;
  addExperience: (experience: number) => void;
  addStatusPoint: (point: number) => void;
}

const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      character: null,
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
      addStatusPoint: (point: number) =>
        set((state) => ({
          character: state.character
            ? { ...state.character, availableStatusPoints: point }
            : null,
        })),
    }),
    {
      name: 'character-storage', // unique name for localStorage key
      partialize: (state) => ({ character: state.character }), // only persist character data
    }
  )
);

export default useCharacterStore;
