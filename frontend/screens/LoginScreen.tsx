import { useNavigation } from "@react-navigation/native";
import { Formik, FormikProps } from "formik";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { signInRequested } from "../store/auth/slice";

interface LoginFormProps {
  email?: string;
  password?: string;
}

export const LoginScreen = () => {
  const formRef = React.useRef<FormikProps<LoginFormProps>>(null);
  const loadingSignIn = useAppSelector((state) => state.auth.loadingLogin);
  const errorSignIn = useAppSelector((state) => state.auth.errorLogin);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const onLogin = async (values: LoginFormProps) => {
    const { email, password } = values;
    if (!email || !password) return;
    dispatch(signInRequested({ email, password }));
  };

  const ProfileSchema = Yup.object().shape({
    email: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: COLORS.black }]}>
      <View style={styles.headerContainer}>
        <Text style={[FONTS.h1, { color: COLORS.white }]}>{"Welcome"}</Text>
        <Text style={[FONTS.h2, { color: COLORS.white }]}>{"Sign in below"}</Text>
      </View>
      <Formik
        innerRef={formRef}
        initialValues={{ email: "", password: "" }}
        validationSchema={ProfileSchema}
        onSubmit={onLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <View style={styles.fieldContainer}>
            <FormInput
              label={"Email"}
              placeholder={"jimmy123@gmail.com"}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={errors.email}
              touched={touched.email}
            />
            <FormInput
              label={"Password"}
              placeholder={"*********"}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              error={errors.password}
              touched={touched.password}
              secureTextEntry={true}
              style={{ marginTop: SIZES.padding }}
            />
            {!!errorSignIn && (
              <Text style={{ color: COLORS.red, paddingTop: SIZES.padding }}>
                {"Login failed. Please try again."}
              </Text>
            )}
            <Button
              type={"contained"}
              label={"Login"}
              loading={loadingSignIn}
              onPress={() => handleSubmit()}
              style={{ marginTop: SIZES.padding }}
            />
            <Button
              type={"contained"}
              label={"Sign Up"}
              onPress={() => navigation.navigate("SignupScreen")}
              style={{ marginTop: SIZES.padding }}
            />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center" },
  headerContainer: { marginLeft: SIZES.padding, marginTop: SIZES.padding },
  fieldContainer: { flex: 1, marginHorizontal: SIZES.padding, marginTop: SIZES.padding },
});
