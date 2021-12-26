import React from "react";
import { ActivityIndicator, View } from "react-native";

import { COLORS } from "../constants";

export const StartupScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
      }}
    >
      <ActivityIndicator />
    </View>
  );
};
