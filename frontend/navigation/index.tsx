import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useTheme } from "react-native-paper";

import { FONTS } from "../constants";
import { NotificationScreen, StartupScreen, TranslucentScreen } from "../screens";

import Tabs from "./tabs";

export type AppStackParamList = {
  MainLayout: undefined;
  NotificationScreen: undefined;
  TranslucentScreen: undefined;
};

export const AppStack = () => {
  const Stack = createStackNavigator<AppStackParamList>();
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        headerTitleStyle: [FONTS.h2, { color: colors.text }],
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={"MainLayout"}
    >
      <Stack.Screen name="MainLayout" component={Tabs} />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: true,
          title: "Notifications",
        }}
      />
      <Stack.Screen name="TranslucentScreen" component={TranslucentScreen} />
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
