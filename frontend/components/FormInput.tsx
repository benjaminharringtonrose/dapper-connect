import * as React from "react";
import { Text } from "react-native";
import { useTheme } from "react-native-paper";

import { COLORS } from "../constants";

import { Input, InputProps } from "./Input";

export interface FormInputProps extends InputProps {
  error?: string;
  touched?: boolean;
}
const FormInput = (props: FormInputProps) => {
  const { colors } = useTheme();
  return (
    <>
      <Input {...props} />
      {!!props.error && !!props.touched && (
        <Text
          style={{
            marginTop: 3,
            color: colors.error,
          }}
        >
          {props.error}
        </Text>
      )}
    </>
  );
};

export default FormInput;
