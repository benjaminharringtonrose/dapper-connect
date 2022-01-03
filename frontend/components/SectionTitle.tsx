import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

import { COLORS, FONTS } from "../constants";
const SectionTitle = ({
  title,
  containerStyle,
}: {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={containerStyle}>
      <Text style={[FONTS.h3, { color: COLORS.lightGray3 }]}>{title}</Text>
    </View>
  );
};

export default SectionTitle;
