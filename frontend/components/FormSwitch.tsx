import React from "react";
import { Switch, Text, View } from "react-native";

import { FONTS } from "../constants";

const FormSwitch = ({ label, value, setFieldValue, colors, style }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text style={[FONTS.body4, { flex: 1, color: colors.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={setFieldValue}
        trackColor={{ true: colors.primary, false: colors.bottomTabInactive }}
      />
    </View>
  );
};

export default FormSwitch;
