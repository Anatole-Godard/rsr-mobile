import { fetchRSR } from "utils/fetchRSR";
import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext({});
import { AuthStack } from "stacks/AuthStack";

import { API_URL } from "@env";

/**
 * Provider that handles authentication with Gardian
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
  //   const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  //todo: link with async storage

  const [user, setUser] = useState<any | null>(null); // todo: get from async storage

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
      // set AsyncStorage

      setUser(body);
    } else setUser(null);
  };

  const signOut = async () => {
    const response = await fetchRSR(API_URL + "/auth/revoke", user.session, {
      method: "POST",
    });
    const body = await response.json();
    if (body.error) {
      // remove AsyncStorage

      setUser(null);
    }

    if (response.ok) {
      // remove AsyncStorage

      setUser(null);
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    birthDate: string
  ) => {
    const response = await fetch("/api/auth/register", {
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

      // set AsyncStorage
    } else setUser(null);
  };

  const changePicture = async (picture: string) => {
    setUser({
      ...user,
      data: { ...user.data, photoURL: `${picture}?${Date.now()}` },
    });

    // set AsyncStorage
  };

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
