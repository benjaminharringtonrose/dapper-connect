import * as React from "react";
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { COLORS } from "../constants";

export interface InputProps extends TextInputProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  footnote?: string;
}
export const Input = React.forwardRef<TextInput, InputProps>((props: InputProps, ref) => {
  return (
    <View
      style={[
        {
          opacity: 0.8,
          borderColor: COLORS.white,
          borderBottomWidth: 1,
        },
        props.style,
      ]}
    >
      {!!props.label && (
        <Text
          style={{
            fontWeight: "600",
            color: COLORS.white,
          }}
        >
          {props.label}
        </Text>
      )}
      <TextInput
        ref={ref}
        placeholderTextColor={COLORS.white}
        selectionColor={COLORS.white}
        autoCapitalize={"none"}
        {...props}
        style={[
          {
            opacity: 0.8,
            minHeight: 40,
            color: COLORS.white,
          },
          props.inputStyle,
        ]}
      />
    </View>
  );
});

export const EmailInput = React.forwardRef<TextInput, InputProps>((props: InputProps, ref) => (
  <Input
    ref={ref}
    placeholder={"Email"}
    textContentType="emailAddress"
    autoCompleteType="email"
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    {...props}
  />
));
