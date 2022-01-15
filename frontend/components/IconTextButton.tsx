import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { FONTS } from "../constants";

interface IconTextButtonProps {
  label: string;
  icon?: ImageSourcePropType;
  customIcon?: () => JSX.Element;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  colors: ReactNativePaper.ThemeColors;
}

const IconTextButton = ({
  label,
  customIcon,
  containerStyle,
  onPress,
  colors,
}: IconTextButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        { flexDirection: "column", justifyContent: "center", alignItems: "center" },
        containerStyle,
      ]}
    >
      {customIcon && customIcon()}
      <Text style={[FONTS.h3, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default IconTextButton;
