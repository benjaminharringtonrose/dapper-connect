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
          opacity: 0.8,
          borderColor: props.colors.border,
          borderBottomWidth: props?.noBorder ? 0 : 1,
        },
        props.style,
      ]}
    >
      {!!props.label && (
        <Text
          style={{
            fontWeight: "600",
            color: props.colors.text,
          }}
        >
          {props.label}
        </Text>
      )}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          ref={ref}
          placeholderTextColor={props.colors.text}
          selectionColor={props.colors.text}
          autoCapitalize={"none"}
          {...props}
          style={[
            {
              opacity: 0.8,
              minHeight: 40,
              color: props.colors.text,
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
