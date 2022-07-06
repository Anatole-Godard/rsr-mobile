import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
const PreferencesContext = createContext({});

import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  setColorScheme: Dispatch<
    // eslint-disable-next-line no-unused-vars
    ("light" | "dark") | ((colorScheme: "light" | "dark") => "light" | "dark")
  >;
}): JSX.Element {
  const toggleColorScheme = () => {
    setColorScheme((colorScheme: "light" | "dark") =>
      colorScheme === "light" ? "dark" : "light"
    );
  };

  const [notificationPermission, setNotificationPermission] =
    useState<boolean>(false);

  const [channelStoriesDisplay, setChannelStoriesDisplay] =
    useState<boolean>(true);

  const toggleChannelStoriesDisplay = () =>
    setChannelStoriesDisplay((old) => !old);

  const askPermissions = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
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
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "RSR",
          body,
          ...(link ? { link } : null),
        },
        trigger: {
          seconds: 1,
        },
      });
    }
  };

  useEffect(() => {
    askPermissions().then(setNotificationPermission);

    AsyncStorage.getItem("@channelStoriesDisplay").then((value) => {
      if (value === "false") {
        setChannelStoriesDisplay(false);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      "@channelStoriesDisplay",
      channelStoriesDisplay.toString()
    );
  }, [channelStoriesDisplay]);

  return (
    <PreferencesContext.Provider
      value={{
        colorScheme,
        toggleColorScheme,
        sendNotificationImmediately,
        notificationPermission,

        channelStoriesDisplay,
        toggleChannelStoriesDisplay,
      }}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {children}
    </PreferencesContext.Provider>
  );
}

type PreferencesContextType = {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  // eslint-disable-next-line no-unused-vars
  sendNotificationImmediately: (params: {
    body: string;
    link?: string;
  }) => void;
  notificationPermission: boolean;
  channelStoriesDisplay: boolean;
  toggleChannelStoriesDisplay: () => void;
};
/**
 * Get preferences from context
 *
 * @returns context
 */
export const usePreferences = () =>
  useContext(PreferencesContext) as PreferencesContextType;
