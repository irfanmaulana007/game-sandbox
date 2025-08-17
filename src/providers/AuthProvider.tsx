import { useEffect, useState, type ReactNode } from 'react';
import { authService } from '~/services/auth-service';
import { AuthContext, type AuthContextType } from '~/context/auth-context';
import type { Users } from '~/types/model/schema';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Users | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        // You can add an API call here to verify the token and get user data
        // For now, we'll just check if the token exists
        const response = await authService.getUser();
        if (response.success) {
          setUser(response.data);
        } else {
          throw new Error(response.message);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await authService.login({
      username,
      password,
    });

    if (response.success) {
      setUser(response.data.user);
    } else {
      throw new Error(response.message);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await authService.register({
      username,
      email,
      password,
      confirmPassword: password,
    });

    if (response.success) {
      setUser(response.data.user);
    } else {
      throw new Error(response.message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear user state even if server logout fails
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
