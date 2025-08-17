# Authentication System Setup Guide

## Overview
This authentication system provides user registration, login, and logout functionality with protected routes and automatic token management.

## Features
- ✅ User registration with validation
- ✅ User login with error handling
- ✅ Protected routes for authenticated users
- ✅ Automatic token management
- ✅ Responsive UI with Tailwind CSS
- ✅ Form validation and error handling
- ✅ Loading states and user feedback
- ✅ Toast notifications for all operations
- ✅ Error boundaries with user-friendly error handling
- ✅ Centralized context management

## File Structure

```
src/
├── services/
│   ├── api.ts                 # Base API configuration with Axios
│   ├── query-client.ts        # TanStack Query client configuration
│   ├── QueryProvider.tsx      # React Query provider component
│   ├── index.ts              # Main exports
│   ├── character-service.ts   # Character-related services
│   ├── equipment-service.ts   # Equipment-related services
│   ├── monster-service.ts     # Monster-related services
│   ├── map-service.ts         # Map-related services
│   ├── battle-service.ts      # Battle-related services
│   ├── user-service.ts        # User profile and inventory services
│   ├── auth-service.ts        # Authentication services
│   └── setup.md              # This documentation
├── context/
│   ├── index.ts              # Context exports
│   ├── auth-context.tsx      # Authentication context
│   └── toast-context.tsx     # Toast notifications context
├── hooks/
│   ├── index.ts              # Hooks exports
│   ├── useApiError.ts        # API error handling hook
│   └── ...                   # Other custom hooks
└── components/
    ├── ErrorBoundary.tsx     # Error boundary with toast support
    └── ...                   # Other components
```

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in your project root:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Backend API Endpoints Required
Your backend should implement these endpoints:

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

#### Expected Request/Response Formats

**Register:**
```json
POST /api/auth/register
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}

Response:
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string (optional)"
  },
  "token": "string",
  "refreshToken": "string",
  "expiresIn": "number"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "string",
  "password": "string"
}

Response:
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatar": "string (optional)"
  },
  "token": "string",
  "refreshToken": "string",
  "expiresIn": "number"
}
```

**Logout:**
```json
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
```

### 3. Token Storage
- Access tokens are stored in `localStorage` as `auth_token`
- Refresh tokens are stored in `localStorage` as `refresh_token`
- Tokens are automatically included in API requests
- Tokens are cleared on logout or 401 responses

### 4. Protected Routes
The following routes require authentication:
- `/` - Home page (shows landing page for unauthenticated users)
- `/character` - Character management
- `/onboarding` - Character creation
- `/map/:mapId` - Map details
- `/inventory` - User inventory
- `/equipment` - Equipment management

**Note**: Unauthenticated users are always redirected to `/login` when trying to access protected content.

### 5. Authentication Flow
1. User visits any route
2. If not authenticated and trying to access protected content, redirected to `/login`
3. User logs in successfully
4. Redirected to original destination or home
5. Token stored automatically
6. Subsequent requests include token
7. All protected routes require authentication

### 6. Error Handling
- Form validation errors
- API error responses
- Network errors
- Token expiration handling
- Toast notifications for all errors and success messages

### 7. Toast Notifications (Sonner)
The app uses Sonner for toast notifications:
- **Success toasts**: Green notifications for successful operations
- **Error toasts**: Red notifications for errors and failures
- **Warning toasts**: Yellow notifications for warnings
- **Info toasts**: Blue notifications for informational messages
- **Loading toasts**: For long-running operations

#### Toast Context Usage
```tsx
import { useToast } from '../context';

function MyComponent() {
  const { success, error, warning, info, loading } = useToast();
  
  const handleSuccess = () => {
    success('Operation completed successfully!');
  };
  
  const handleError = () => {
    error('Something went wrong!');
  };
}
```

#### API Error Handling Hook
```tsx
import { useApiError } from '../hooks';

function MyComponent() {
  const { handleError } = useApiError();
  
  const handleApiCall = async () => {
    try {
      await apiCall();
    } catch (error) {
      handleError(error, 'Custom fallback message');
    }
  };
}
```

## Usage Examples

### Using Authentication in Components
```tsx
import { useAuth } from '../services/auth-context';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Route Component
```tsx
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

## Customization

### Styling
- All components use Tailwind CSS classes
- Color schemes can be modified in the component files
- Responsive design included

### Validation Rules
- Username: 3-20 characters
- Email: Valid email format
- Password: 6-50 characters
- Confirm password: Must match password

### Redirect Behavior
- After login: Redirects to home page
- After registration: Redirects to home page
- Failed authentication: Stays on current page with error
- Protected routes: Redirects to login page

## Security Considerations

1. **Token Storage**: Currently uses localStorage (consider httpOnly cookies for production)
2. **HTTPS**: Ensure API endpoints use HTTPS in production
3. **Input Validation**: All user inputs are validated
4. **Error Messages**: Generic error messages to prevent information leakage
5. **Token Refresh**: Automatic token refresh on expiration

## Troubleshooting

### Common Issues

1. **Routes not working**: Check if QueryProvider and AuthProvider are wrapping your app
2. **Authentication not persisting**: Verify localStorage is enabled
3. **API calls failing**: Check VITE_API_BASE_URL environment variable
4. **Protected routes redirecting**: Ensure user is properly authenticated

### Debug Mode
- Check browser console for error messages
- Verify localStorage contents
- Check network tab for API calls
- Use React Query DevTools for debugging

## Next Steps

1. Implement your backend API endpoints
2. Test authentication flow
3. Customize styling as needed
4. Add additional protected routes
5. Implement user profile management
6. Add password reset functionality
7. Implement email verification
