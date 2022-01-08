import CheckBox from "@react-native-community/checkbox";
import React from "react";
import { Text, View } from "react-native";

import { FONTS, SIZES } from "../constants";

const FormCheckBox = ({ label, value, onSetFieldValue, touched, error, colors, style }) => {
  return (
    <View style={style}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CheckBox
          value={value}
          onValueChange={onSetFieldValue}
          boxType={"square"}
          onCheckColor={colors.primary}
          onTintColor={colors.primary}
        />
        <Text style={[FONTS.body4, { color: colors.text, marginLeft: SIZES.radius }]}>{label}</Text>
      </View>
      {!!error && !!touched && (
        <Text
          style={{
            marginTop: SIZES.radius,
            color: colors.error,
            paddingLeft: SIZES.radius,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default FormCheckBox;
