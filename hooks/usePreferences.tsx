type PreferencesContextType = {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  sendNotificationImmediately: (params: {
    body: string;
    link?: string;
  }) => void;
  notificationPermission: boolean;
};

import React, { createContext, useContext, useEffect, useState } from "react";
const PreferencesContext = createContext({});

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

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

  const [notificationPermission, setNotificationPermission] =
    useState<boolean>(false);

  const askPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  };

  const sendNotificationImmediately = async ({
    body,
    link,
  }: {
    body: string;
    link?: string;
  }) => {
    if (notificationPermission) {
      let notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "RSR",
          body,
          ...(link ? { link } : null),
        },
        trigger: {
          seconds: 1,
        },
      });
      console.log(notificationId); // can be saved in AsyncStorage or send to server
    }
  };

  useEffect(() => {
    askPermissions().then(setNotificationPermission);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        colorScheme,
        toggleColorScheme,
        sendNotificationImmediately,
        notificationPermission,
      }}
    >
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
