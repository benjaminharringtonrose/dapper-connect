import React from "react";
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

import { COLORS, FONTS } from "../constants";

const TextButton = ({
  label,
  containerStyle,
  textStyle,
  onPress,
  colors,
}: {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  colors: any;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 3,
          paddingHorizontal: 18,
          borderRadius: 15,
          backgroundColor: COLORS.gray1,
          minWidth: 30,
        },
        containerStyle,
      ]}
    >
      <Text style={[FONTS.h5, { color: colors.text }, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;
