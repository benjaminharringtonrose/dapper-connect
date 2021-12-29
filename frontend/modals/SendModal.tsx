import { Feather } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Web3 from "web3";
import * as Yup from "yup";

import { Button } from "../components/Button";
import { FormInput } from "../components/FormInput";
import { COLORS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setToastMessages } from "../store/settings/slice";

interface FormProps {
  amount?: string;
  address?: string;
}

export const SendModal = forwardRef(
  (
    { onPress, web3, address }: { onPress: () => void; web3: Web3; address: string },
    ref: Ref<Modalize>
  ) => {
    const formRef = React.useRef<FormikProps<FormProps>>(null);

    const ProfileSchema = Yup.object().shape({
      amount: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
    });

    const { account, user } = useAppSelector((state) => state.account);
    const dispatch = useAppDispatch();
    const connector = useWalletConnect();
    const insets = useSafeAreaInsets();
    const { toastMessages } = useAppSelector((state) => state.settings);
    const { holdings } = useAppSelector((state) => state.market);

    const [loading, setLoading] = useState<boolean>(false);
    const [reviewVisible, setReviewVisible] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormProps>();
    const [transactionFee, setTransactionFee] = useState<string | undefined>();
    const [maxTotal, setMaxTotal] = useState<string | undefined>();

    const calculateTransactionFee = async (values: FormProps) => {
      const wallet = user.wallets.find((wallet) => wallet.address === address);
      const wei = web3.utils.toWei(values.amount, "ether");
      const tx = {
        data: "0x",
        from: wallet.address,
        to: values.address,
        value: web3.utils.numberToHex(Number(wei)),
      };
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await web3.eth.estimateGas(tx);
      const currentEtherPrice = holdings.find((holding) => holding.id === "ethereum").currentPrice;
      const transactionFee = web3.utils.fromWei(
        (Number(gasPrice) * gasLimit * currentEtherPrice).toString(),
        "ether"
      );
      console.log(transactionFee);
      const maxTotal = (
        Number(transactionFee) +
        Number(values.amount) * currentEtherPrice
      ).toString();
      return {
        transactionFee,
        maxTotal,
      };
    };

    const onReview = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const formData = formRef.current?.values;
      try {
        const { transactionFee, maxTotal } = await calculateTransactionFee(formData);
        setTransactionFee(transactionFee);
        setMaxTotal(maxTotal);
        setFormData(formData);
        setReviewVisible(true);
      } catch (e) {
        console.log(e);
      }
    };

    const onSubmit = async (values: FormProps) => {
      if (!values.amount || !values.address) {
        return;
      }
      try {
        setLoading(true);
        // send transaction logic goes here
        const wallet = user.wallets.find((wallet) => wallet.address === address);
        console.log(wallet.provider);
        const wei = web3.utils.toWei(values.amount, "ether");
        if (wallet.provider === "walletconnect") {
          if (connector.connected) {
            try {
              await connector.sendTransaction({
                data: "0x",
                from: wallet?.address,
                to: values.address,
                value: web3.utils.numberToHex(Number(wei)),
              });
              console.log("success");
            } catch (error) {
              console.log(error);
            }
          }
        } else if (wallet.provider === "local") {
          const tx = {
            data: "0x",
            from: wallet?.address,
            to: values.address,
            value: web3.utils.numberToHex(Number(wei)),
          };
          const gasLimit = await web3.eth.estimateGas(tx);
          const signedTx = await web3.eth.accounts.signTransaction(
            {
              ...tx,
              gas: gasLimit,
            },
            wallet.privateKey
          );
          web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
            if (!error) {
              console.log("🎉 The hash of your transaction is: ", hash);
            } else {
              console.log("❗Something went wrong while submitting your transaction:", error);
            }
          });
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
              {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
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
                  {reviewVisible && (
                    <View>
                      <Text style={{ color: COLORS.white }}>{transactionFee}</Text>
                      <Text style={{ color: COLORS.white }}>{maxTotal}</Text>
                    </View>
                  )}

                  <Button
                    type={"bordered"}
                    label={"Review"}
                    loading={loading}
                    onPress={onReview}
                    style={{ marginTop: SIZES.padding }}
                  />
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
