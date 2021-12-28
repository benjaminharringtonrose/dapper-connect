import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { COLORS, FONTS, SIZES } from "../constants";

interface IconTextButtonProps {
  label: string;
  icon?: ImageSourcePropType;
  customIcon?: () => JSX.Element;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const IconTextButton = ({
  label,
  icon,
  customIcon,
  containerStyle,
  onPress,
}: IconTextButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.gray,
        },
        containerStyle,
      ]}
    >
      {customIcon ? customIcon() : <Image source={icon} style={{ width: 20, height: 20 }} />}
      <Text style={[FONTS.h3, { marginLeft: SIZES.base, color: COLORS.white }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default IconTextButton;
