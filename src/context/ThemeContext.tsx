import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'genz';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  success: string;
}

export const lightTheme: ThemeColors = {
  background: '#FAF7F5',
  card: '#FFFFFF',
  text: '#1F2937',
  subText: '#6B7280',
  border: '#E5E7EB',
  primary: '#14B8A6',
  secondary: '#10B981',
  accent: '#F5D5CB',
  error: '#EF4444',
  success: '#10B981',
};

export const darkTheme: ThemeColors = {
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  subText: '#9CA3AF',
  border: '#374151',
  primary: '#14B8A6',
  secondary: '#10B981',
  accent: '#374151',
  error: '#EF4444',
  success: '#10B981',
};

export const genzTheme: ThemeColors = {
  background: '#09090B',
  card: '#12121A',
  text: '#E2E8F0',
  subText: '#94A3B8',
  border: 'rgba(0, 229, 255, 0.2)',
  primary: '#00E5FF',
  secondary: '#007BFF',
  accent: '#FF003C',
  error: '#FF003C',
  success: '#00FF9D',
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
  isDark: boolean;
  isGenZ: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('genz');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('user_theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'genz') {
        setThemeState(savedTheme as ThemeType);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('user_theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const colors = theme === 'genz' ? genzTheme : (theme === 'dark' ? darkTheme : lightTheme);
  const isDark = theme === 'dark' || theme === 'genz';
  const isGenZ = theme === 'genz';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, isDark, isGenZ }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
