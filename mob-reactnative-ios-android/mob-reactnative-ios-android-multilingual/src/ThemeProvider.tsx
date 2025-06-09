import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkThemeStyles, lightThemeStyles } from './globalStyles';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext({ theme: null });

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkThemeStyles : lightThemeStyles);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkThemeStyles : lightThemeStyles);
  }, [colorScheme]);
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};
