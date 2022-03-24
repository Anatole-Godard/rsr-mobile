import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "pages/auth/Login";
import WelcomeScreen from "pages/auth/Welcome";
import RegisterScreen from "pages/auth/Register";
import ForgotPassword from "pages/auth/ForgotPassword";
const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPassword} />
    </Stack.Navigator>
  );
};
