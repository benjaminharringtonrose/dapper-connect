import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

import { Button, FormInput } from "../components";
import { COLORS, SIZES } from "../constants";
import { createNextAccount } from "../helpers";
import { useAppDispatch } from "../hooks";
import { getAccountRequested } from "../store/account";
import { addAccountRequested } from "../store/wallet";

interface FormProps {
  name?: string;
}

interface CreateAccountModalProps {
  onPress: (address: string) => void;
  colors: ReactNativePaper.ThemeColors;
}

export const CreateAccountModal = forwardRef(
  (props: CreateAccountModalProps, ref: Ref<Modalize>) => {
    const formRef = React.useRef<FormikProps<FormProps>>(null);

    const ValidationSchema = Yup.object().shape({
      name: Yup.string().required("required"),
    });

    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (values: FormProps) => {
      if (!values.name) {
        return;
      }
      try {
        setLoading(true);
        const newAccount = await createNextAccount(values.name);
        dispatch(addAccountRequested({ account: newAccount }));
        props.onPress(newAccount.address);
        dispatch(getAccountRequested({ address: newAccount.address }));
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
                name: undefined,
              }}
              validationSchema={ValidationSchema}
              onSubmit={onSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
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
                      label={"Account Name"}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      autoCorrect={true}
                      value={values.name}
                      error={errors.name}
                      touched={touched.name}
                      inputStyle={{ flex: 1 }}
                      colors={props.colors}
                      noBorder
                    />
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
          <View style={{ backgroundColor: props.colors.modal, paddingBottom: insets.bottom }} />
        </Modalize>
      </Portal>
    );
  }
);
