import * as React from "react";
import { Text } from "react-native";

import { Input, InputProps } from "./Input";

export interface FormInputProps extends InputProps {
  error?: string;
  touched?: boolean;
  colors: ReactNativePaper.ThemeColors;
  icon?: () => JSX.Element | null;
}
const FormInput = (props: FormInputProps) => {
  return (
    <>
      <Input {...props} />
      {!!props.error && !!props.touched && (
        <Text
          style={{
            marginTop: 3,
            color: props.colors.error,
          }}
        >
          {props.error}
        </Text>
      )}
    </>
  );
};

export default FormInput;
