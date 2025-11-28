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
    const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    let newUser: User;
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // If it's the same email, restore the full profile
      if (parsedUser.email === email) {
        newUser = parsedUser;
      } else {
        // Different email, check for stored profile
        if (storedProfiles[email]) {
          newUser = storedProfiles[email];
        } else {
          newUser = { email, avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}` };
          const storedAvatars = JSON.parse(localStorage.getItem('avatars') || '{}');
          if (storedAvatars[email]) {
            newUser.avatarUrl = storedAvatars[email];
          }
        }
      }
    } else {
      // No stored user, check for stored profile
      if (storedProfiles[email]) {
        newUser = storedProfiles[email];
      } else {
        newUser = { email, avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}` };
        const storedAvatars = JSON.parse(localStorage.getItem('avatars') || '{}');
        if (storedAvatars[email]) {
          newUser.avatarUrl = storedAvatars[email];
        }
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
      
      // Also update profile storage
      const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}');
      if (storedProfiles[user.email]) {
        storedProfiles[user.email] = { ...storedProfiles[user.email], avatarUrl: url };
        localStorage.setItem('profiles', JSON.stringify(storedProfiles));
      }
    }
  };

  const updateProfile = (profile: Partial<Omit<User, 'email'>>) => {
    if (user) {
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Store full profile permanently by email
      const storedProfiles = JSON.parse(localStorage.getItem('profiles') || '{}');
      storedProfiles[user.email] = updatedUser;
      localStorage.setItem('profiles', JSON.stringify(storedProfiles));
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

