import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { StartupScreen } from "../screens/StartupScreen";

import Tabs, { defaultNavigationOptions } from "./tabs";

export const AppStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"MainLayout"}>
      <Stack.Screen name="MainLayout" component={Tabs} />
    </Stack.Navigator>
  );
};
export const StartupStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"StartupScreen"}>
      <Stack.Screen name="StartupScreen" component={StartupScreen} />
    </Stack.Navigator>
  );
};
