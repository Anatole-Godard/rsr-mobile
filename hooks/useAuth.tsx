import { fetchRSR } from "utils/fetchRSR";
import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext({});
import { AuthStack } from "stacks/AuthStack";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "constants/env";

import { Vibration } from "react-native";

/**
 * Provider that handles authentication
 *
 * Returns children if logged in, otherwise returns NotLogged
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<any | null>(null);

  const signIn = async (email: string, password: string) => {
    // let API_URL = "http:/192.168.0.23:3000/api";
    const response = await fetch(API_URL + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appsource: "mobile",
      },
      body: JSON.stringify({ email, password }),
    });

    const body = await response.json();
    if (response.ok && body.session && body.data) {
      Vibration.vibrate([1000]);
      setUser(body);
    } else setUser(null);
  };

  const signOut = async () => {
    try {
      const response = await fetchRSR(API_URL + "/auth/revoke", user.session, {
        method: "POST",
      });
      const body = await response.json();

      if (response.ok) {
        await AsyncStorage.removeItem("@user");
        setUser(null);
      }
    } catch (error) {
      let err: { name: string } = error as any;
      if (err.name === "TokenExpiredError") {
        await AsyncStorage.removeItem("@user");
        setUser(null);
      }
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    birthDate: string
  ) => {
    const response = await fetch(API_URL + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appsource: "mobile",
      },
      body: JSON.stringify({ email, password, fullName, birthDate }),
    });
    const body = await response.json();
    if (response.ok && body.session && body.data) {
      setUser(body);

      Vibration.vibrate([1000]);
    } else setUser(null);
  };

  const changePicture = async (picture: string) => {
    setUser({
      ...user,
      data: { ...user.data, photoURL: `${picture}?${Date.now()}` },
    });

    // set AsyncStorage
  };

  useEffect(() => {}, [user]);

  useEffect(() => {
    if (user) AsyncStorage.setItem("@user", JSON.stringify(user));
    else {
      if (user === null)
        AsyncStorage.getItem("@user")
          .then((user) => {
            if (user) {
              setUser(JSON.parse(user));
            }
          })
          .catch((err) => {
            console.error(err);
          });
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, register, changePicture }}
    >
      {user ? children : <AuthStack />}
    </AuthContext.Provider>
  );
}

interface AuthContextType {
  user: any;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  register: (
    email: string,
    password: string,
    fullName: string,
    birthDate: string
  ) => void;
  changePicture: (picture: string) => void;
}

/**
 * Get auth credentials with the use of the react context
 *
 * @returns context
 */
export const useAuth = () => useContext(AuthContext) as AuthContextType;
