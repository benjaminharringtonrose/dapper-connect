import { Entypo } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";

import { Button, FormInput } from "../components";
import { FONTS, SIZES } from "../constants";
import { usePassword } from "../hooks/usePassword";

import RootView from "./RootView";

interface FormProps {
  password?: string;
}

const ViewSeedPhraseScreen = () => {
  const { colors } = useTheme();
  const formRef = React.useRef<FormikProps<FormProps>>(null);

  const password = usePassword();

  const ValidationSchema = Yup.object().shape({
    password: Yup.string().oneOf([password, null], "incorrect password").required("required"),
  });

  const onSubmit = async (values: FormProps) => {
    if (!values.password) {
      return;
    }
  };
  return (
    <RootView>
      <>
        <Formik
          innerRef={formRef}
          initialValues={{ password: undefined }}
          validationSchema={ValidationSchema}
          onSubmit={onSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <View style={{ margin: SIZES.padding }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={[FONTS.h2, { paddingBottom: SIZES.radius, color: colors.text }]}>
                  {"View Seed Phrase"}
                </Text>
                <Entypo name={"lock"} size={24} color={colors.text} />
              </View>

              <Text style={[FONTS.body4, { paddingBottom: SIZES.radius, color: colors.text }]}>
                {"Enter your password to see your seed phrase."}
              </Text>
              <View
                style={{
                  backgroundColor: colors.input,
                  borderRadius: SIZES.radius,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: SIZES.radius,
                  marginVertical: SIZES.radius,
                }}
              >
                <FormInput
                  label={"password"}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  autoCorrect={true}
                  value={values.password}
                  error={errors.password}
                  touched={touched.password}
                  inputStyle={{ flex: 1 }}
                  colors={colors}
                  secureTextEntry={true}
                  noBorder
                />
              </View>
              <Button
                label={"View"}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleSubmit();
                }}
                style={{ marginVertical: SIZES.radius }}
                colors={colors}
              />
            </View>
          )}
        </Formik>
      </>
    </RootView>
  );
};

export default ViewSeedPhraseScreen;
