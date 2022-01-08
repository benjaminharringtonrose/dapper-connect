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

export type ButtonProps = TouchableOpacityProps & {
  readonly type?: "contained" | "bordered" | "text";
  readonly label: string;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly textColor?: string;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly colors: ReactNativePaper.ThemeColors;
};

const Button = (props: ButtonProps) => {
  const { type = "contained", textColor } = props;
  const contentColor = textColor ? textColor : props.colors.background;

  return (
    <TouchableOpacity
      {...props}
      disabled={props.loading || props.disabled}
      style={[
        {
          backgroundColor: props.disabled ? props.colors.disabled : props.colors.primary,
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
          <Text
            style={[
              {
                color: contentColor,
                fontWeight: "600",
              },
              props.textStyle,
            ]}
          >
            {props.label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
