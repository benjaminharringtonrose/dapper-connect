import CheckBox from "@react-native-community/checkbox";
import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { Text, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

import { Button, FormInput } from "../components";
import { COLORS, SIZES } from "../constants";
import { useAppDispatch } from "../hooks";

interface FormProps {
  newPassword?: string;
  confirmPassword?: string;
  acceptedTCs?: boolean;
}

interface OnboardCreateModalProps {
  onPress: (address: string) => void;
  colors: ReactNativePaper.ThemeColors;
}

export const OnboardCreateWalletModal = forwardRef(
  (props: OnboardCreateModalProps, ref: Ref<Modalize>) => {
    const formRef = React.useRef<FormikProps<FormProps>>(null);

    const ProfileSchema = Yup.object().shape({
      newPassword: Yup.string().required("Required"),
      confirmPassword: Yup.string().required("Required"),
      acceptedTCs: Yup.boolean().required("Required"),
    });

    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (values: FormProps) => {
      if (!values.newPassword || !values.confirmPassword || !values.acceptedTCs) {
        return;
      }
      try {
        setLoading(true);

        ///////////
        ////////// need to implement
        ///////////
      } catch (error) {
        setLoading(false);
        console.warn(error.message);
      }
    };
    return (
      <Portal>
        <Modalize
          ref={ref}
          useNativeDriver={false}
          adjustToContentHeight={true}
          modalStyle={{
            backgroundColor: COLORS.black,
            bottom: insets.bottom,
          }}
          handleStyle={{ backgroundColor: props.colors.modalHandle }}
        >
          <View>
            <Formik
              innerRef={formRef}
              initialValues={{
                newPassword: undefined,
                confirmPassword: undefined,
                acceptedTCs: undefined,
              }}
              validationSchema={ProfileSchema}
              onSubmit={onSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                touched,
                errors,
              }) => (
                <View style={{ margin: SIZES.padding }}>
                  <View
                    style={{
                      backgroundColor: COLORS.gray,
                      borderRadius: SIZES.radius,
                      borderWidth: 1,
                      borderColor: COLORS.lightGray,
                      padding: SIZES.radius,
                    }}
                  >
                    <FormInput
                      label={"New Password"}
                      onChangeText={handleChange("newPassword")}
                      onBlur={handleBlur("newPassword")}
                      autoCorrect={true}
                      value={values.newPassword}
                      error={errors.newPassword}
                      touched={touched.newPassword}
                      inputStyle={{ flex: 1 }}
                      colors={props.colors}
                      secureTextEntry={true}
                      noBorder
                    />
                    <View
                      style={{
                        height: 1,
                        backgroundColor: props.colors.border,
                        marginVertical: SIZES.radius,
                      }}
                    />
                    <FormInput
                      label={"Confirm Password"}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      autoCorrect={true}
                      value={values.confirmPassword}
                      error={errors.confirmPassword}
                      touched={touched.confirmPassword}
                      inputStyle={{ flex: 1 }}
                      colors={props.colors}
                      secureTextEntry={true}
                      noBorder
                    />
                  </View>
                  <View style={{ marginTop: SIZES.padding }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CheckBox
                        value={values.acceptedTCs}
                        onValueChange={(nextValue) => setFieldValue("acceptedTCs", nextValue)}
                        boxType={"square"}
                        onCheckColor={props.colors.primary}
                        onTintColor={props.colors.primary}
                      />
                      <Text style={{ color: props.colors.text, marginLeft: SIZES.radius }}>
                        {"I have read and agree to the Terms of Use"}
                      </Text>
                    </View>
                    {!!errors.acceptedTCs && (
                      <Text
                        style={{
                          marginTop: SIZES.radius,
                          color: props.colors.error,
                          paddingLeft: SIZES.radius,
                        }}
                      >
                        {errors.acceptedTCs}
                      </Text>
                    )}
                  </View>

                  <Button
                    type={"bordered"}
                    label={"Create"}
                    loading={loading}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      handleSubmit();
                    }}
                    style={{ marginTop: SIZES.padding }}
                    colors={props.colors}
                  />
                </View>
              )}
            </Formik>
          </View>
        </Modalize>
      </Portal>
    );
  }
);
