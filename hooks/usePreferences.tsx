type PreferencesContextType = {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
};

import React, { createContext, useContext, useEffect } from "react";
const PreferencesContext = createContext({});

import { StatusBar } from "expo-status-bar";

/**

 * @returns {JSX.Element}
 */
export function PreferencesProvider({
  children,
  colorScheme = "light",
  setColorScheme,
}: {
  children: React.ReactNode;
  colorScheme: "light" | "dark";
  setColorScheme: any;
}): JSX.Element {
  const toggleColorScheme = () => {
    setColorScheme((colorScheme: "light" | "dark") =>
      colorScheme === "light" ? "dark" : "light"
    );
  };

  return (
    <PreferencesContext.Provider value={{ colorScheme, toggleColorScheme }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {children}
    </PreferencesContext.Provider>
  );
}

/**
 * Get preferences from context
 *
 * @returns context
 */
export const usePreferences = () =>
  useContext(PreferencesContext) as PreferencesContextType;
