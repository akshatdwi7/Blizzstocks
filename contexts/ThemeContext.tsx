import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    surfaceSecondary: string;
    surfaceTertiary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    shadow: string;
    overlay: string;
    card: string;
    cardSecondary: string;
    positive: string;
    negative: string;
    neutral: string;
    gradient: {
      primary: string[];
      secondary: string[];
      success: string[];
      warning: string[];
      error: string[];
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    h1: { fontSize: number; fontFamily: string; lineHeight: number };
    h2: { fontSize: number; fontFamily: string; lineHeight: number };
    h3: { fontSize: number; fontFamily: string; lineHeight: number };
    body: { fontSize: number; fontFamily: string; lineHeight: number };
    caption: { fontSize: number; fontFamily: string; lineHeight: number };
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    secondary: '#3B82F6',
    accent: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceSecondary: '#F1F5F9',
    surfaceTertiary: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#64748B',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    shadow: 'rgba(15, 23, 42, 0.1)',
    overlay: 'rgba(15, 23, 42, 0.5)',
    card: '#FFFFFF',
    cardSecondary: '#F8FAFC',
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#64748B',
    gradient: {
      primary: ['#10B981', '#059669'],
      secondary: ['#3B82F6', '#1D4ED8'],
      success: ['#10B981', '#059669'],
      warning: ['#F59E0B', '#D97706'],
      error: ['#EF4444', '#DC2626'],
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 32, fontFamily: 'Inter-Bold', lineHeight: 40 },
    h2: { fontSize: 24, fontFamily: 'Inter-Bold', lineHeight: 32 },
    h3: { fontSize: 20, fontFamily: 'Inter-SemiBold', lineHeight: 28 },
    body: { fontSize: 16, fontFamily: 'Inter-Regular', lineHeight: 24 },
    caption: { fontSize: 14, fontFamily: 'Inter-Regular', lineHeight: 20 },
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    secondary: '#3B82F6',
    accent: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    surfaceTertiary: '#475569',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    border: '#334155',
    borderLight: '#475569',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    card: '#1E293B',
    cardSecondary: '#334155',
    positive: '#10B981',
    negative: '#EF4444',
    neutral: '#64748B',
    gradient: {
      primary: ['#10B981', '#059669'],
      secondary: ['#3B82F6', '#1D4ED8'],
      success: ['#10B981', '#059669'],
      warning: ['#F59E0B', '#D97706'],
      error: ['#EF4444', '#DC2626'],
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setIsDark(colorScheme === 'dark');

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}