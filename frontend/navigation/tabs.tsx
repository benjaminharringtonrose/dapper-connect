import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { StackNavigationOptions } from "@react-navigation/stack";
import React from "react";
import { useTheme } from "react-native-paper";

import { TabIcon } from "../components";
import { COLORS, FONTS } from "../constants";
import { AssetsScreen, HomeScreen, SettingsScreen } from "../screens";

const Tab = createBottomTabNavigator();

export const defaultNavigationOptions: BottomTabNavigationOptions & StackNavigationOptions = {
  headerTitleStyle: [FONTS.h3, { color: COLORS.white }],
  headerStyle: {
    backgroundColor: COLORS.black,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
};

const Tabs = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleStyle: [FONTS.h3, { color: colors.text }],
        headerStyle: {
          backgroundColor: colors.background,
          shadowRadius: 0,
          shadowOffset: {
            height: 0,
            width: 0,
          },
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: COLORS.gray,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitle: "Crypto",
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={"graph"} label={"Crypto"} colors={colors} />
          ),
        }}
      />
      <Tab.Screen
        name="AssetsScreen"
        component={AssetsScreen}
        options={{
          headerTitle: "Assets",
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={"briefcase"} label={"Assets"} colors={colors} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="MarketScreen"
        component={MarketScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) =>
            !isTradeModalVisible && <TabIcon focused={focused} icon={"market"} label={"Market"} />,
        }}
      /> */}
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerTitle: "Settings",
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={"settings"} label={"Settings"} colors={colors} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
