import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { Text, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

import { secureStore } from "../classes";
import { Button, FormCheckBox, FormInput, FormSwitch } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch } from "../hooks";
import { toggleFaceId } from "../store/settings";

interface FormProps {
  mnemonic?: string;
  newPassword?: string;
  confirmPassword?: string;
  acceptedTCs?: boolean;
  faceID?: boolean;
}

interface OnboardExistingModalProps {
  onUseExistingWallet: (seed: string) => void;
  colors: ReactNativePaper.ThemeColors;
}

export const OnboardExistingWalletModal = forwardRef(
  (props: OnboardExistingModalProps, ref: Ref<Modalize>) => {
    const formRef = React.useRef<FormikProps<FormProps>>(null);

    const ValidationSchema = Yup.object().shape({
      mnemonic: Yup.string().required("required"),
      newPassword: Yup.string().required("required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "passwords must match")
        .required("required"),
      acceptedTCs: Yup.boolean()
        .isTrue("you must accept the Terms of Use to use this product")
        .required("required"),
    });

    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (values: FormProps) => {
      if (
        !values.mnemonic ||
        !values.newPassword ||
        !values.confirmPassword ||
        !values.acceptedTCs
      ) {
        return;
      }
      try {
        setLoading(true);
        await secureStore.setAcknowledgements(true);
        await secureStore.setPassword(values.confirmPassword);
        dispatch(toggleFaceId({ faceID: values?.faceID }));
        await secureStore.setFaceID(values?.faceID);
        props.onUseExistingWallet(values?.mnemonic);
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
          modalStyle={{
            backgroundColor: props.colors.modal,
          }}
          handleStyle={{ backgroundColor: props.colors.modalHandle }}
        >
          <View>
            <Formik
              innerRef={formRef}
              initialValues={{
                mnemonic: undefined,
                newPassword: undefined,
                confirmPassword: undefined,
                acceptedTCs: undefined,
                faceID: undefined,
              }}
              validationSchema={ValidationSchema}
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
                      {"Use Existing Mnemonic"}
                    </Text>
                    <Entypo name={"lock-open"} size={24} color={props.colors.text} />
                  </View>

                  <Text
                    style={[
                      FONTS.body4,
                      { paddingBottom: SIZES.radius, color: props.colors.textGray },
                    ]}
                  >
                    {"Import a wallet using your existing 12-word mnemonic phrase."}
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
                      label={"Mnemonic Phrase"}
                      onChangeText={handleChange("mnemonic")}
                      onBlur={handleBlur("mnemonic")}
                      autoCorrect={true}
                      value={values.mnemonic}
                      error={errors.mnemonic}
                      touched={touched.mnemonic}
                      inputStyle={{ flex: 1 }}
                      colors={props.colors}
                      secureTextEntry={true}
                      noBorder
                    />
                  </View>
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
                  <Text
                    style={[
                      FONTS.body4,
                      { paddingBottom: SIZES.radius, color: props.colors.textGray },
                    ]}
                  >
                    {
                      "Since your password will be securely stored on your device, DapperConnect cannot recover it for you."
                    }
                  </Text>
                  <FormCheckBox
                    label={"I have read and agree to the Terms of Use"}
                    value={values.acceptedTCs}
                    onSetFieldValue={(nextValue) => setFieldValue("acceptedTCs", nextValue)}
                    touched={touched.acceptedTCs}
                    error={errors.acceptedTCs}
                    colors={props.colors}
                    style={{ marginVertical: SIZES.radius }}
                  />
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
