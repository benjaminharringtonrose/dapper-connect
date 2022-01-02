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
  icon?: () => JSX.Element;
  noBorder?: boolean;
}

const Input = React.forwardRef<TextInput, InputProps>((props: InputProps, ref) => {
  return (
    <View
      style={[
        {
          opacity: 0.8,
          borderColor: COLORS.white,
          borderBottomWidth: props?.noBorder ? 0 : 1,
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        {!!props?.icon && props?.icon()}
      </View>
    </View>
  );
});

export default Input;
