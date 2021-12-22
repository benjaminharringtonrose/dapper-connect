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
  icon: ImageSourcePropType;
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
        <Image
          source={icon}
          resizeMode={"contain"}
          style={[
            {
              width: 25,
              height: 25,
              tintColor: COLORS.white,
            },
            iconStyle,
          ]}
        />
        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>{"Trade"}</Text>
      </View>
    );
  } else {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={icon}
          resizeMode={"contain"}
          style={[
            {
              width: 25,
              height: 25,
              tintColor: focused ? COLORS.white : COLORS.secondary,
            },
            iconStyle,
          ]}
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
