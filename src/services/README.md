# Service Module Documentation

This service module provides a complete backend service layer using Axios for HTTP requests and TanStack Query for state management and caching.

## Architecture Overview

The service module is organized into several layers:

1. **API Layer** (`api.ts`) - Base Axios configuration with interceptors
2. **Query Client** (`query-client.ts`) - TanStack Query configuration and query keys
3. **Service Layer** - Individual services for each domain
4. **React Hooks** - Custom hooks for components to consume services

## File Structure

```
src/services/
├── api.ts                 # Base API configuration with Axios
├── query-client.ts        # TanStack Query client configuration
├── QueryProvider.tsx      # React Query provider component
├── index.ts              # Main exports
├── character-service.ts   # Character-related services
├── equipment-service.ts   # Equipment-related services
├── monster-service.ts     # Monster-related services
├── map-service.ts         # Map-related services
├── battle-service.ts      # Battle-related services
├── user-service.ts        # User profile and inventory services
├── auth-service.ts        # Authentication services
└── README.md             # This documentation
```

## Setup

### 1. Install Dependencies

```bash
npm install axios @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Wrap Your App

```tsx
import { QueryProvider } from './services/QueryProvider';

function App() {
  return (
    <QueryProvider>
      {/* Your app components */}
    </QueryProvider>
  );
}
```

### 3. Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Usage Examples

### Basic Query Hook

```tsx
import { useCharacters } from '../services/character-service';

function CharacterList() {
  const { data: characters, isLoading, error } = useCharacters();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {characters?.map(character => (
        <div key={character.id}>{character.name}</div>
      ))}
    </div>
  );
}
```

### Mutation Hook

```tsx
import { useCreateCharacter } from '../services/character-service';

function CreateCharacterForm() {
  const createCharacter = useCreateCharacter();

  const handleSubmit = (formData: CharacterFormData) => {
    createCharacter.mutate(formData, {
      onSuccess: () => {
        // Handle success
      },
      onError: (error) => {
        // Handle error
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={createCharacter.isPending}
      >
        {createCharacter.isPending ? 'Creating...' : 'Create Character'}
      </button>
    </form>
  );
}
```

### Conditional Queries

```tsx
import { useCharacter } from '../services/character-service';

function CharacterDetail({ characterId }: { characterId?: string }) {
  const { data: character, isLoading } = useCharacter(characterId);

  // Query only runs when characterId is provided
  if (!characterId) return <div>No character selected</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div>{character?.name}</div>;
}
```

## Service Features

### 1. Automatic Caching
- All queries are automatically cached
- Configurable stale time and garbage collection
- Smart cache invalidation on mutations

### 2. Error Handling
- Automatic retry logic for failed requests
- Different retry strategies for queries vs mutations
- Centralized error handling in interceptors

### 3. Authentication
- Automatic token injection in requests
- Token refresh handling
- Automatic logout on 401 responses

### 4. Development Tools
- React Query DevTools in development mode
- Request/response logging
- Performance monitoring

## API Configuration

### Base Configuration

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = 10000; // 10 seconds
```

### Request Interceptors

- Automatic authentication token injection
- Development logging
- Request transformation

### Response Interceptors

- Response logging
- Error handling and status code management
- Automatic token cleanup on 401 responses

## Query Client Configuration

### Default Options

```typescript
defaultOptions: {
  queries: {
    staleTime: 5 * 60 * 1000,        // 5 minutes
    gcTime: 10 * 60 * 1000,          // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  }
}
```

## Query Keys

Organized query keys for consistent cache management:

```typescript
export const queryKeys = {
  characters: {
    all: ['characters'],
    lists: () => [...queryKeys.characters.all, 'list'],
    list: (filters: string) => [...queryKeys.characters.lists(), { filters }],
    details: () => [...queryKeys.characters.all, 'detail'],
    detail: (id: string | number) => [...queryKeys.characters.details(), id],
  },
  // ... other domains
};
```

## Available Services

### Character Service
- `useCharacters()` - Get all characters
- `useCharacter(id)` - Get character by ID
- `useCreateCharacter()` - Create new character
- `useUpdateCharacter()` - Update character
- `useDeleteCharacter()` - Delete character
- `useLevelUpCharacter()` - Level up character
- `useAddExperience()` - Add experience to character

### Equipment Service
- `useEquipment()` - Get all equipment
- `useEquipmentById(id)` - Get equipment by ID
- `useEquipmentCategories()` - Get equipment categories
- `useEquipmentByCategory(category)` - Get equipment by category
- `useSearchEquipment(query, filters)` - Search equipment
- `useCreateEquipment()` - Create new equipment
- `useUpdateEquipment()` - Update equipment
- `useDeleteEquipment()` - Delete equipment

### Monster Service
- `useMonsters()` - Get all monsters
- `useMonsterById(id)` - Get monster by ID
- `useMonstersByMap(mapId)` - Get monsters by map
- `useMonstersByLevel(level)` - Get monsters by level
- `useSearchMonsters(query, filters)` - Search monsters
- `useCreateMonster()` - Create new monster
- `useUpdateMonster()` - Update monster
- `useDeleteMonster()` - Delete monster

### Map Service
- `useMaps()` - Get all maps
- `useMapById(id)` - Get map by ID
- `useMapsByLevel(level)` - Get maps by level requirement
- `useMapsByDifficulty(difficulty)` - Get maps by difficulty
- `useSearchMaps(query, filters)` - Search maps
- `useCreateMap()` - Create new map
- `useUpdateMap()` - Update map
- `useDeleteMap()` - Delete map

### Battle Service
- `useBattleHistory(filters)` - Get battle history
- `useCurrentBattle()` - Get current active battle
- `useBattleStatus(battleId)` - Get battle status
- `useStartBattle()` - Start new battle
- `useBattleAction()` - Perform battle action
- `useEndBattle()` - End battle

### User Service
- `useUserProfile()` - Get user profile
- `useUserStats()` - Get user statistics
- `useUserInventory()` - Get user inventory
- `useUpdateUserProfile()` - Update user profile
- `useUpdatePreferences()` - Update user preferences
- `useEquipItem()` - Equip item
- `useUnequipItem()` - Unequip item
- `useUseItem()` - Use item

### Auth Service
- `useLogin()` - User login
- `useRegister()` - User registration
- `useLogout()` - User logout
- `useForgotPassword()` - Forgot password
- `useResetPassword()` - Reset password
- `useVerifyEmail()` - Verify email

## Best Practices

### 1. Error Handling
Always handle loading and error states:

```tsx
const { data, isLoading, error } = useCharacters();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <NoDataMessage />;
```

### 2. Optimistic Updates
Use `setQueryData` for immediate UI updates:

```tsx
const updateCharacter = useUpdateCharacter();

const handleUpdate = (id: string, data: Partial<Character>) => {
  updateCharacter.mutate({ id, data }, {
    onSuccess: (updatedCharacter) => {
      // Cache is automatically updated
    }
  });
};
```

### 3. Cache Invalidation
Let mutations handle cache invalidation automatically:

```tsx
const deleteCharacter = useDeleteCharacter();

const handleDelete = (id: string) => {
  deleteCharacter.mutate(id, {
    onSuccess: () => {
      // Cache is automatically invalidated
      // Related queries are refetched
    }
  });
};
```

### 4. Query Keys
Use consistent query key patterns:

```tsx
// Good - consistent pattern
const { data } = useCharacter(characterId);

// Good - with filters
const { data } = useCharacters('level=10&class=warrior');

// Good - conditional queries
const { data } = useMonstersByMap(mapId, { enabled: !!mapId });
```

## Troubleshooting

### Common Issues

1. **Queries not refetching**: Check if `enabled` is set correctly
2. **Cache not updating**: Verify query keys are consistent
3. **Infinite loops**: Ensure dependencies in `useEffect` are correct
4. **Authentication errors**: Check token storage and refresh logic

### Debug Mode

Enable React Query DevTools to monitor:
- Query states
- Cache contents
- Network requests
- Performance metrics

## Performance Considerations

1. **Stale Time**: Adjust based on data freshness requirements
2. **Garbage Collection**: Balance memory usage with cache hit rates
3. **Background Refetching**: Use `refetchOnWindowFocus` judiciously
4. **Query Deduplication**: Multiple components can share the same query

## Security

1. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
2. **Automatic Cleanup**: Tokens are cleared on logout and 401 responses
3. **HTTPS**: Ensure API endpoints use HTTPS in production
4. **Input Validation**: Validate all user inputs before sending to API
