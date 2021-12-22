import * as React from "react";
import { Text } from "react-native";

import { COLORS } from "../constants";

import { Input, InputProps } from "./Input";

export interface FormInputProps extends InputProps {
  error?: string;
  touched?: boolean;
}
export const FormInput = (props: FormInputProps) => {
  return (
    <>
      <Input {...props} />
      {!!props.error && !!props.touched && (
        <Text
          style={{
            marginTop: 3,
            color: COLORS.red,
          }}
        >
          {props.error}
        </Text>
      )}
    </>
  );
};
