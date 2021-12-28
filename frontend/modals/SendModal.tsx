import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import * as Yup from "yup";

import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { COLORS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";

interface FormProps {
  amount?: string;
  address?: string;
}

export const SendModal = forwardRef(({ onPress }: { onPress: () => void }, ref: Ref<Modalize>) => {
  const formRef = React.useRef<FormikProps<FormProps>>(null);

  const ProfileSchema = Yup.object().shape({
    amount: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
  });

  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: FormProps) => {
    if (!values.amount || !values.address) {
      return;
    }
    try {
      setLoading(true);
      // send transaction logic goes here
      if (user.walletProvider === "walletconnect") {
        if (connector.connected) {
          await connector.sendTransaction({
            from: user?.walletAddress,
            gas: "0x9c40",
            gasPrice: "0x02540be400",
            nonce: "0x0114",
            to: values.address,
            value: values.amount,
          });
          console.log("success");
        }
      } else if (user.walletProvider === "local") {
        //
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.warn(error.message);
    }
    onPress();
  };

  return (
    <Portal>
      <Modalize ref={ref} adjustToContentHeight={true} useNativeDriver={false}>
        <View style={{ minHeight: 300, backgroundColor: COLORS.black }}>
          <Formik
            innerRef={formRef}
            initialValues={{
              amount: undefined,
              address: undefined,
            }}
            validationSchema={ProfileSchema}
            onSubmit={onSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
              <View style={{ marginHorizontal: SIZES.padding }}>
                <FormInput
                  label={"Amount"}
                  placeholder={"ETH"}
                  onChangeText={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  keyboardType={"decimal-pad"}
                  autoCorrect={true}
                  value={values.amount}
                  error={errors.amount}
                  touched={touched.amount}
                  style={{ marginBottom: SIZES.padding }}
                />
                <FormInput
                  label={"Address"}
                  placeholder={"0xbc28Ea04101F03a....."}
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                  autoCorrect={true}
                  value={values.address}
                  error={errors.address}
                  touched={touched.address}
                />
                <Button
                  type={"contained"}
                  label={"Send"}
                  // loading={loadingAddEvent}
                  onPress={() => handleSubmit()}
                  style={{ marginTop: SIZES.padding }}
                />
              </View>
            )}
          </Formik>
        </View>
      </Modalize>
    </Portal>
  );
});
