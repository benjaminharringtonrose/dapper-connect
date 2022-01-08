import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as React from "react";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { FONTS } from "../constants";

type Icons = "copy" | "check";

export type ButtonProps = TouchableOpacityProps & {
  readonly type?: "contained" | "bordered" | "text";
  readonly label: string;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly textColor?: string;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly colors: ReactNativePaper.ThemeColors;
  readonly postfixIcon?: Icons;
  readonly prefixIcon?: Icons;
};

const Button = (props: ButtonProps) => {
  const { type = "contained", textColor } = props;
  const contentColor = textColor ? textColor : props.colors.background;

  const getIcon = (iconName: Icons) => {
    switch (iconName) {
      case "copy":
        return <Feather name={"copy"} size={24} color={props.colors.background} />;
      case "check":
        return <Entypo name={"check"} size={24} color={props.colors.background} />;
    }
  };

  return (
    <TouchableOpacity
      {...props}
      disabled={props.loading || props.disabled}
      style={[
        {
          backgroundColor: props.disabled ? props.colors.disabled : props.colors.button,
          paddingHorizontal: type !== "text" ? 10 : 0,
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
          minHeight: 45,
          borderRadius: 10,
        },
        props.style,
      ]}
    >
      {props.loading ? (
        <ActivityIndicator color={props.colors.accent} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {!!props.prefixIcon && (
            <View style={{ paddingRight: 6 }}>{getIcon(props.postfixIcon)}</View>
          )}
          <Text style={[FONTS.h3, { color: contentColor }, props.textStyle]}>{props.label}</Text>
          {!!props.postfixIcon && (
            <View style={{ paddingLeft: 6 }}>{getIcon(props.postfixIcon)}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
