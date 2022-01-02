import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import React from "react";
import { ImageStyle, StyleProp, Text, View, ViewStyle } from "react-native";

import { COLORS } from "../constants/theme";

interface TabIconProps {
  focused: boolean;
  icon: string;
  iconStyle?: StyleProp<ViewStyle & ImageStyle>;
  label: string;
  isTrade?: boolean;
}

const TabIcon = ({ focused, icon, iconStyle, label }: TabIconProps) => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case "graph":
        return (
          <SimpleLineIcons
            name={"graph"}
            size={20}
            color={focused ? COLORS.white : COLORS.secondary}
            style={iconStyle}
          />
        );
      default:
        return (
          <Ionicons
            name={icon as any}
            color={focused ? COLORS.white : COLORS.secondary}
            size={20}
            style={iconStyle}
          />
        );
    }
  };
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {getIcon(icon)}
      <Text
        style={[
          {
            color: focused ? COLORS.white : COLORS.secondary,
          },
          iconStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export default TabIcon;
