import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_USERS } from '../data/demoData';

const AUTH_USER_KEY = '@finance_app_current_user_v2';
const USERS_LIST_KEY = '@finance_app_users_list_v2';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted user and users list on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_LIST_KEY);
        let activeUsers = DEFAULT_USERS;
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          // Ensure Bala BJ and Krixxeey are always present and up-to-date
          const hasBala = parsed.some((u) => u.email === 'balabj@gmail.com');
          const hasKrixxeey = parsed.some((u) => u.email === 'krixxeey@gmail.com');
          if (hasBala && hasKrixxeey) {
            activeUsers = parsed;
          } else {
            activeUsers = DEFAULT_USERS;
            await AsyncStorage.setItem(USERS_LIST_KEY, JSON.stringify(DEFAULT_USERS));
          }
          setUsers(activeUsers);
        } else {
          await AsyncStorage.setItem(USERS_LIST_KEY, JSON.stringify(DEFAULT_USERS));
        }

        const storedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.email === 'balabj@gmail.com' || parsedUser.email === 'krixxeey@gmail.com') {
            setCurrentUser(parsedUser);
          }
        }
      } catch (error) {
        console.warn('Failed to load auth state from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save current user to storage whenever it changes
  const saveUserSession = async (user) => {
    try {
      if (user) {
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (e) {
      console.warn('Failed to update user session:', e);
    }
  };

  // Sign In function (accepts 'password' or 'password123' for demo accounts)
  const signIn = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => {
      const matchEmail = u.email.toLowerCase() === trimmedEmail;
      const matchPass =
        u.password === password ||
        (password === 'password' && u.password === 'password123') ||
        (password === 'password123' && u.password === 'password');
      return matchEmail && matchPass;
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid email address or password. Please use password for demo login.',
      };
    }

    setCurrentUser(user);
    await saveUserSession(user);
    return { success: true, user };
  };

  // Quick Sign In for demo / evaluation convenience
  const quickSignIn = async (role = 'customer') => {
    const user = users.find((u) => u.role === role) || DEFAULT_USERS.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      await saveUserSession(user);
      return { success: true, user };
    }
    return { success: false, error: `No demo ${role} account available` };
  };

  // Sign Up function
  const signUp = async ({ name, email, password, role = 'customer', phone = '', occupation = '' }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists.',
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password,
      role,
      phone: phone.trim() || '+91 98765 00000',
      occupation: occupation.trim() || (role === 'admin' ? 'Finance Administrator' : 'Client Customer'),
      avatar: name.trim().split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'BJ',
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    try {
      await AsyncStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
      await saveUserSession(newUser);
    } catch (e) {
      console.warn('Failed to persist new user:', e);
    }

    return { success: true, user: newUser };
  };

  // Update Profile function
  const updateProfile = async (updatedData) => {
    if (!currentUser) return { success: false, error: 'No authenticated user' };

    const updated = {
      ...currentUser,
      ...updatedData,
      avatar: updatedData.name
        ? updatedData.name.trim().split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
        : currentUser.avatar,
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updated : u));

    setCurrentUser(updated);
    setUsers(updatedUsers);

    try {
      await AsyncStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
      await saveUserSession(updated);
    } catch (e) {
      console.warn('Failed to persist profile update:', e);
    }

    return { success: true, user: updated };
  };

  // Sign Out function
  const signOut = async () => {
    setCurrentUser(null);
    await saveUserSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        signIn,
        quickSignIn,
        signUp,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
