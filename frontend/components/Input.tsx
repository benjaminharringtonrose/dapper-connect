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

import { FONTS } from "../constants";

export interface InputProps extends TextInputProps {
  label?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  footnote?: string;
  icon?: () => JSX.Element;
  noBorder?: boolean;
  colors: ReactNativePaper.ThemeColors;
}

export const Input = React.forwardRef<TextInput, InputProps>((props: InputProps, ref) => {
  return (
    <View
      style={[
        {
          borderColor: props.colors.border,
          borderBottomWidth: props?.noBorder ? 0 : 1,
        },
        props.style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          {!!props.label && (
            <Text
              style={{
                fontWeight: "600",
                color: props.colors.textGray,
              }}
            >
              {props.label}
            </Text>
          )}
          <TextInput
            ref={ref}
            placeholderTextColor={props.colors.textGray}
            selectionColor={props.colors.textGray}
            autoCapitalize={"none"}
            {...props}
            style={[
              FONTS.body2,
              {
                flex: 1,
                minHeight: 40,
                color: props.colors.textGray,
              },
              props.inputStyle,
            ]}
          />
        </View>
        {!!props?.icon && props?.icon()}
      </View>
    </View>
  );
});

export default Input;
