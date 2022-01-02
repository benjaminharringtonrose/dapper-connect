import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { COLORS, FONTS } from "../constants/theme";

interface TabIconProps {
  focused: boolean;
  icon: string;
  iconStyle?: StyleProp<ViewStyle & ImageStyle>;
  label: string;
  isTrade?: boolean;
}

const TabIcon = ({ focused, icon, iconStyle, label, isTrade }: TabIconProps) => {
  if (isTrade) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: COLORS.black,
        }}
      >
        <Ionicons
          name={icon as any}
          style={iconStyle}
          color={focused ? COLORS.white : COLORS.secondary}
          size={30}
        />
        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>{"Trade"}</Text>
      </View>
    );
  } else {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Ionicons
          name={icon as any}
          style={iconStyle}
          color={focused ? COLORS.white : COLORS.secondary}
          size={20}
        />
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
  }
};

export default TabIcon;
