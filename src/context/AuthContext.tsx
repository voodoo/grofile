import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  avatarUrl?: string;
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateAvatar: (url: string) => void;
  updateProfile: (profile: Partial<Omit<User, 'email'>>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    // Check if we have an existing user stored
    const storedUser = localStorage.getItem('user');
    let newUser: User;
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // If it's the same email, restore the full profile
      if (parsedUser.email === email) {
        newUser = parsedUser;
      } else {
        // Different email, create new user but check for stored avatar
        newUser = { email, avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}` };
        const storedAvatars = JSON.parse(localStorage.getItem('avatars') || '{}');
        if (storedAvatars[email]) {
          newUser.avatarUrl = storedAvatars[email];
        }
      }
    } else {
      // No stored user, create new one
      newUser = { email, avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}` };
      // Check if we have a stored avatar for this email
      const storedAvatars = JSON.parse(localStorage.getItem('avatars') || '{}');
      if (storedAvatars[email]) {
        newUser.avatarUrl = storedAvatars[email];
      }
    }
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateAvatar = (url: string) => {
    if (user) {
      const updatedUser = { ...user, avatarUrl: url };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Store permanently for this email
      const storedAvatars = JSON.parse(localStorage.getItem('avatars') || '{}');
      storedAvatars[user.email] = url;
      localStorage.setItem('avatars', JSON.stringify(storedAvatars));
    }
  };

  const updateProfile = (profile: Partial<Omit<User, 'email'>>) => {
    if (user) {
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateAvatar, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

