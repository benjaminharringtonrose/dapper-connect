import { Feather } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Web3 from "web3";
import * as Yup from "yup";

import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { COLORS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";

interface FormProps {
  amount?: string;
  address?: string;
}

export const SendModal = forwardRef(
  ({ onPress, web3 }: { onPress: () => void; web3: Web3 }, ref: Ref<Modalize>) => {
    const formRef = React.useRef<FormikProps<FormProps>>(null);

    const ProfileSchema = Yup.object().shape({
      amount: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
    });

    const { user } = useAppSelector((state) => state.account);
    const dispatch = useAppDispatch();
    const connector = useWalletConnect();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState<boolean>(false);
    const [address, setAddress] = useState<string>("");

    const onSubmit = async (values: FormProps) => {
      if (!values.amount || !values.address) {
        return;
      }
      try {
        setLoading(true);
        // send transaction logic goes here
        if (user.walletProvider === "walletconnect") {
          if (connector.connected) {
            const wei = web3.utils.toWei(values.amount, "ether");
            await connector.sendTransaction({
              data: "0x",
              from: user?.walletAddress,
              to: values.address,
              value: web3.utils.numberToHex(Number(wei)),
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
        <Modalize
          ref={ref}
          useNativeDriver={false}
          adjustToContentHeight={true}
          modalStyle={{
            backgroundColor: COLORS.black,
          }}
        >
          <View style={{ height: Dimensions.get("screen").height / 2 }}>
            <Formik
              innerRef={formRef}
              initialValues={{
                amount: undefined,
                address: undefined,
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
                      padding: SIZES.padding,
                    }}
                  >
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
                      inputStyle={{ flex: 1 }}
                      noBorder
                    />
                    <View
                      style={{ height: 2, backgroundColor: COLORS.lightGray, marginVertical: 10 }}
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
                      inputStyle={{ flex: 1 }}
                      icon={() => (
                        <TouchableOpacity
                          style={{ padding: SIZES.radius }}
                          onPress={async () => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            const clipboard = await Clipboard.getString();
                            formRef.current?.setFieldValue("address", clipboard);
                          }}
                        >
                          <Feather name="clipboard" size={24} color={COLORS.lightGray3} />
                        </TouchableOpacity>
                      )}
                      noBorder
                    />
                  </View>
                  <Button
                    type={"bordered"}
                    label={"Send"}
                    loading={loading}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      handleSubmit();
                    }}
                    style={{ marginTop: SIZES.padding }}
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
