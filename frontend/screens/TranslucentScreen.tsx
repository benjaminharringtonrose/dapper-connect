import React from "react";
import { View } from "react-native";

import { COLORS } from "../constants";

const TranslucentScreen = () => {
  return <View style={{ flex: 1, backgroundColor: COLORS.lightGray, opacity: 0.7 }} />;
};

export default TranslucentScreen;
