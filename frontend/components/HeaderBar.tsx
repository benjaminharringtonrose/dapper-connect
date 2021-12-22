import React from "react";
import { Text, View } from "react-native";

import { COLORS, FONTS } from "../constants";

const HeaderBar = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        justifyContent: "flex-end",
      }}
    >
      <Text style={[FONTS.h1, { color: COLORS.white }]}>{title}</Text>
    </View>
  );
};

export default HeaderBar;
