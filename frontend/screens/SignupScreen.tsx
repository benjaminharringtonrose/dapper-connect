import { useNavigation } from "@react-navigation/native";
import { Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

import { BackButton } from "../components/BackButton";
import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { signUpRequested } from "../store/auth/slice";

interface SignUpFormProps {
  email?: string;
  password?: string;
}

export const SignupScreen = () => {
  const formRef = React.useRef<FormikProps<SignUpFormProps>>(null);

  const loadingSignUp = useAppSelector((state) => state.auth.loadingSignUp);
  const errorSignUp = useAppSelector((state) => state.auth.errorSignOut);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return <BackButton onPress={() => navigation.pop()} />;
      },
    });
  }, []);

  const onSignUp = async (values: SignUpFormProps) => {
    const { email, password } = values;
    if (!email || !password) {
      return;
    }
    console.log(email, password);
    dispatch(signUpRequested({ email, password }));
  };

  const ProfileSchema = Yup.object().shape({
    email: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <SafeAreaView style={[styles.background, { backgroundColor: COLORS.black }]}>
      <View style={styles.headerContainer}>
        <Text style={[FONTS.h1, { color: COLORS.white, paddingBottom: SIZES.padding }]}>
          {"Sign up below"}
        </Text>
        <Text style={[FONTS.h2, { color: COLORS.white }]}>{"Provide an email\n and password"}</Text>
      </View>
      <Formik
        innerRef={formRef}
        initialValues={{ email: "", password: "" }}
        validationSchema={ProfileSchema}
        onSubmit={onSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <View style={styles.fieldWrapper}>
            <FormInput
              label={"Email"}
              placeholder={"jimmy123@gmail.com"}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={errors.email}
              touched={touched.email}
              style={{ marginTop: SIZES.padding }}
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
            {!!errorSignUp && (
              <Text style={{ color: COLORS.red, paddingTop: SIZES.padding }}>
                {"Login failed. Please try again."}
              </Text>
            )}
            <Button
              type={"contained"}
              label={"Sign Up"}
              loading={loadingSignUp}
              onPress={() => handleSubmit()}
              style={{ marginTop: SIZES.padding }}
            />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center" },
  headerContainer: { marginLeft: SIZES.padding, marginTop: SIZES.padding },
  fieldWrapper: { flex: 1, marginHorizontal: SIZES.padding, marginTop: SIZES.padding },
});
