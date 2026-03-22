import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_THEME = {
  primaryColor: '#6C63FF',
  secondaryColor: '#3F3D56',
  backgroundColor: '#0F0E17',
  cardColor: '#1A1A2E',
  textColor: '#FFFFFE',
  accentColor: '#FF6584',
  fontFamily: 'Inter',
  fontSize: '16',
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    // Fetch current theme on mount
    fetch(`${API_URL}/api/theme`)
      .then((res) => res.json())
      .then((data) => setTheme(data))
      .catch((err) => {
        console.error('Failed to fetch theme:', err);
        setTheme(DEFAULT_THEME);
      });
  }, []);

  // Apply theme as CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--card-color', theme.cardColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    
    // Safety check to prevent '14pxpx' issues from manual config edits
    const safeSizeString = String(theme.fontSize).replace('px', '');
    root.style.setProperty('--font-size', `${safeSizeString}px`);
  }, [theme]);

  const updateTheme = async (updates) => {
    try {
      const res = await fetch(`${API_URL}/api/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update theme');
      }

      const newTheme = await res.json();
      setTheme(newTheme);
      return { success: true };
    } catch (err) {
      console.error('Theme update failed:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
