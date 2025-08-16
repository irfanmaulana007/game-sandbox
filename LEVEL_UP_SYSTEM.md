# Level Up System

## Overview
The Level Up system automatically detects when a character gains experience and levels up, displaying a beautiful floating modal on the right bottom of the screen.

## Features

### Level Up Modal
- **Position**: Fixed position on the right bottom corner
- **Auto-hide**: Automatically disappears after 5 seconds
- **Manual close**: Can be closed manually by clicking the close button
- **Responsive**: Adapts to both light and dark themes

### Information Displayed
1. **Level Information**
   - Previous level vs current level
   - Clear visual indication of level progression

2. **Status Changes**
   - Health, Attack, Defense, Speed, Critical
   - Shows previous value → current value
   - Color-coded changes (green for increases, red for decreases)
   - Directional arrows (↗ for increase, ↘ for decrease, → for no change)

3. **Congratulations Message**
   - Celebratory message with emojis
   - Motivates the player

## Technical Implementation

### Components
- `LevelUpModal.tsx` - The main modal component
- `useLevelUp.ts` - Hook managing level up state
- `useExperience.ts` - Enhanced with level up callback support

### Integration Points
1. **Battle System**: Level up detection happens in the battle system when experience is gained
2. **Character Store**: Tracks character state changes
3. **Experience Hook**: Calls level up callback when leveling occurs

### How It Works
1. Character gains experience from battles
2. `useExperience` hook detects level up eligibility
3. If level up occurs, it calls the `onLevelUp` callback
4. `useLevelUp` hook shows the modal with previous vs current stats
5. Modal displays for 5 seconds or until manually closed

### Usage Example
```tsx
import { useLevelUp } from '~/hooks';
import { LevelUpModal } from '~/components';

const MyComponent = () => {
  const { levelUpState, showLevelUp, hideLevelUp, updatePreviousCharacter } = useLevelUp();
  
  // Track character changes
  useEffect(() => {
    if (character) {
      updatePreviousCharacter(character);
    }
  }, [character, updatePreviousCharacter]);

  return (
    <>
      {/* Your component content */}
      
      <LevelUpModal
        isVisible={levelUpState.isVisible}
        onClose={hideLevelUp}
        character={character}
        previousLevel={levelUpState.previousLevel}
        previousStatus={levelUpState.previousStatus}
      />
    </>
  );
};
```

## Styling
- Uses Tailwind CSS for responsive design
- Custom CSS animations for smooth entrance effects
- Gradient backgrounds for visual appeal
- Dark mode support
- Consistent with existing UI components

## Future Enhancements
- Sound effects on level up
- Particle effects or confetti
- Achievement notifications
- Level up history tracking
- Customizable auto-hide duration
