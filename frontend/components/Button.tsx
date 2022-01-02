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

// import Icon from "react-native-vector-icons/Ionicons";
import { COLORS, FONTS, SIZES } from "../constants";

export type ButtonProps = TouchableOpacityProps & {
  readonly type?: "contained" | "bordered" | "text";
  readonly label: string;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly prefixIcon?: string;
  readonly postfixIcon?: string;
  readonly textColor?: string;
  readonly textStyle?: StyleProp<TextStyle>;
};

const Button = (props: ButtonProps) => {
  const { type = "contained", textColor } = props;
  const contentColor = textColor ? textColor : COLORS.white;
  return (
    <TouchableOpacity
      {...props}
      disabled={props.loading || props.disabled}
      style={[
        {
          backgroundColor: COLORS.gray,
          paddingHorizontal: type !== "text" ? 10 : 0,
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
          minHeight: 45,
          borderRadius: 10,
          opacity: props.disabled || props.loading ? 0.5 : 1.0,
          borderColor: COLORS.lightGray,
          borderWidth: type === "bordered" ? 1 : 0,
        },
        props.style,
      ]}
    >
      {props.loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* {!!props.prefixIcon && (
            <Icon
              name={props.prefixIcon}
              size={20}
              color={contentColor}
              style={{ marginRight: 10 }}
            />
          )} */}
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
          {/* {!!props.postfixIcon && (
            <Icon
              name={props.postfixIcon}
              size={20}
              color={contentColor}
              style={{ marginLeft: spacings.small }}
            />
          )} */}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
