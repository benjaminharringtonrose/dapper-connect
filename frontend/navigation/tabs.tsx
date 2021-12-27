import {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { StackNavigationOptions } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity } from "react-native";

import { TabIcon } from "../components";
import { COLORS, FONTS, icons } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Assets, Home, Market, Profile } from "../screens";
import { setTradeModalVisibility } from "../store/tab/slice";

const Tab = createBottomTabNavigator();

export const defaultNavigationOptions: BottomTabNavigationOptions & StackNavigationOptions = {
  headerTitle: "DapperConnect",
  headerTitleStyle: [FONTS.h2, { color: COLORS.white }],
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
  const dispatch = useAppDispatch();
  const { isTradeModalVisible } = useAppSelector((state) => state.tabs);
  return (
    <Tab.Navigator
      screenOptions={{
        ...defaultNavigationOptions,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 140,
          backgroundColor: COLORS.black,
          borderTopColor: COLORS.gray,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) =>
            !isTradeModalVisible && <TabIcon focused={focused} icon={icons.home} label={"Home"} />,
        }}
        listeners={{
          tabPress: (e) => {
            if (isTradeModalVisible) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen
        name="Assets"
        component={Assets}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) =>
            !isTradeModalVisible && (
              <TabIcon focused={focused} icon={icons.briefcase} label={"Assets"} />
            ),
        }}
        listeners={{
          tabPress: (e) => {
            if (isTradeModalVisible) {
              e.preventDefault();
            }
          },
        }}
      />
      {/* <Tab.Screen
        name="Trade"
        component={Home}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={isTradeModalVisible ? icons.close : icons.trade}
              iconStyle={
                isTradeModalVisible
                  ? {
                      width: 15,
                      height: 15,
                    }
                  : undefined
              }
              label={"Trade"}
              isTrade
            />
          ),
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <TabBarCustomButton
              {...props}
              onPress={() => dispatch(setTradeModalVisibility({ isVisible: !isTradeModalVisible }))}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Market"
        component={Market}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) =>
            !isTradeModalVisible && (
              <TabIcon focused={focused} icon={icons.market} label={"Market"} />
            ),
        }}
        listeners={{
          tabPress: (e) => {
            if (isTradeModalVisible) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          tabBarIcon: ({ focused }) =>
            !isTradeModalVisible && (
              <TabIcon focused={focused} icon={icons.profile} label={"Profile"} />
            ),
        }}
        listeners={{
          tabPress: (e) => {
            if (isTradeModalVisible) {
              e.preventDefault();
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

const TabBarCustomButton = (props: BottomTabBarButtonProps) => {
  return (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      onPress={props.onPress}
    >
      {props.children}
    </TouchableOpacity>
  );
};
