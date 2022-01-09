import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Web3 from "web3";
import * as Yup from "yup";

import { Button, FormInput } from "../components";
import { COLORS, SIZES } from "../constants";
import { createNextWallet } from "../helpers";
import { useAppDispatch } from "../hooks";
import { getAccountRequested } from "../store/account";
import { addWalletRequested } from "../store/wallet";

interface FormProps {
  name?: string;
}

interface CreateModalProps {
  onPress: (address: string) => void;
  web3: Web3;
  colors: ReactNativePaper.ThemeColors;
}

export const CreateWalletModal = forwardRef((props: CreateModalProps, ref: Ref<Modalize>) => {
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
      const newWallet = await createNextWallet(values.name);
      dispatch(addWalletRequested({ wallet: newWallet }));
      props.onPress(newWallet.address);
      dispatch(getAccountRequested({ address: newWallet.address }));
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
          bottom: insets.bottom,
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
                    label={"Name"}
                    placeholder={"My Wallet, etc..."}
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
      </Modalize>
    </Portal>
  );
});
