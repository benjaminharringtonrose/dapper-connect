import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

import { Button, FormCheckBox, FormInput, FormSwitch } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { saveAcknowledgements, savePassword, toggleFaceIDInSecureStorage } from "../helpers";
import { useAppDispatch } from "../hooks";
import { toggleFaceId } from "../store/settings";

interface FormProps {
  newPassword?: string;
  confirmPassword?: string;
  acceptedTCs?: boolean;
  faceID?: boolean;
}

interface OnboardCreateModalProps {
  onCreateNewWallet: () => void;
  colors: ReactNativePaper.ThemeColors;
}

export const OnboardCreateWalletModal = forwardRef(
  (props: OnboardCreateModalProps, ref: Ref<Modalize>) => {
    const formRef = React.useRef<FormikProps<FormProps>>(null);

    const ProfileSchema = Yup.object().shape({
      newPassword: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Required"),
      acceptedTCs: Yup.boolean()
        .isTrue("You must accept the Terms of Use to use this product")
        .required("Required"),
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
        await saveAcknowledgements(true);
        await savePassword(values.confirmPassword);
        dispatch(toggleFaceId({ faceID: values?.faceID }));
        await toggleFaceIDInSecureStorage(values?.faceID ? "true" : "false");
        props.onCreateNewWallet();
        setLoading(false);
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
          modalStyle={{ backgroundColor: props.colors.modal }}
          handleStyle={{ backgroundColor: props.colors.modalHandle }}
        >
          <View>
            <Formik
              innerRef={formRef}
              initialValues={{
                newPassword: undefined,
                confirmPassword: undefined,
                acceptedTCs: undefined,
                faceID: undefined,
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
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text
                      style={[FONTS.h2, { paddingBottom: SIZES.radius, color: props.colors.text }]}
                    >
                      {"1. Secure Your Wallet"}
                    </Text>
                    <Entypo name={"lock"} size={24} color={props.colors.text} />
                  </View>

                  <Text
                    style={[FONTS.body4, { paddingBottom: SIZES.radius, color: props.colors.text }]}
                  >
                    {
                      "You can recover your 12-word recovery phrase with this password if you happen to lose it. Since your password will be securely stored on your device, DapperConnect cannot recover it for you."
                    }
                  </Text>
                  <View
                    style={{
                      backgroundColor: props.colors.input,
                      borderRadius: SIZES.radius,
                      borderWidth: 1,
                      borderColor: COLORS.lightGray,
                      padding: SIZES.radius,
                      marginVertical: SIZES.radius,
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FormCheckBox
                      label={"I have read and agree to the"}
                      value={values.acceptedTCs}
                      onSetFieldValue={(nextValue) => setFieldValue("acceptedTCs", nextValue)}
                      touched={touched.acceptedTCs}
                      error={errors.acceptedTCs}
                      colors={props.colors}
                      style={{ marginVertical: SIZES.radius }}
                    />
                    <TouchableText
                      label={"Terms of Use"}
                      color={props.colors.primary}
                      onPress={() => {
                        //
                      }}
                      containerStyle={{ marginLeft: 4 }}
                    />
                  </View>

                  <FormSwitch
                    label={"Secure wallet with Face ID?"}
                    value={values.faceID}
                    setFieldValue={(nextValue) => setFieldValue("faceID", nextValue)}
                    colors={props.colors}
                    style={{ marginVertical: SIZES.radius }}
                  />
                  <Button
                    type={"bordered"}
                    label={"Create"}
                    loading={loading}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      handleSubmit();
                    }}
                    style={{ marginVertical: SIZES.radius }}
                    colors={props.colors}
                  />
                </View>
              )}
            </Formik>
          </View>
          <View style={{ backgroundColor: props.colors.modal, paddingBottom: insets.bottom }} />
        </Modalize>
      </Portal>
    );
  }
);

const TouchableText = ({ label, color, onPress, containerStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <Text style={[FONTS.body4, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};
