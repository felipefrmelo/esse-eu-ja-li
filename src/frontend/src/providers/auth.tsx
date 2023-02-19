import { useState, createContext, useContext } from 'react';

export type User = {
  access_token: string;
  name: string;
};

export interface AuthProviderContext {
  user?: User;
  login: (email: string, password: string) => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthProviderContext>({} as AuthProviderContext);

export interface AuthResponse {
  data: User;
  status: number;
}

interface AuthProviderProps {
  children: React.ReactNode;
  fetchLoginApi: (name: string, password: string) => Promise<AuthResponse>;
}

interface ErrorResponse {
  message: string;
}

export const AuthProvider = ({ children, fetchLoginApi }: AuthProviderProps) => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetchLoginApi(email, password);
      setUser(response.data);
      setError(null);
    } catch (e) {
      const c = e as ErrorResponse;
      setError(c.message);
    }
  };

  return <AuthContext.Provider value={{ user, login, error }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};
