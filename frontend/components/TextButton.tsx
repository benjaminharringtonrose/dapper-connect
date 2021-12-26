import React from "react";
import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";

import { COLORS, FONTS } from "../constants";

const TextButton = ({
  label,
  containerStyle,
  onPress,
}: {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
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
      <Text style={[FONTS.h5, { color: COLORS.white }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;
