/* eslint-disable react-native/no-color-literals */
import { Feather } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Web3 from "web3";
import * as Yup from "yup";

import { Button, FormInput } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setToastMessages } from "../store/settings";
import { CurrencyFormatter } from "../util";

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

    const dispatch = useAppDispatch();
    const connector = useWalletConnect();
    const insets = useSafeAreaInsets();
    const { toastMessages } = useAppSelector((state) => state.settings);
    const { holdings } = useAppSelector((state) => state.market);
    const holding = holdings.find((holding) => holding.id === "ethereum");
    const { wallets } = useAppSelector((state) => state.wallets);

    const [loading, setLoading] = useState<boolean>(false);
    const [reviewVisible, setReviewVisible] = useState<boolean>(false);
    const [transactionFee, setTransactionFee] = useState<number | undefined>();
    const [maxTotal, setMaxTotal] = useState<number | undefined>();
    const [usdAmount, setUsdAmount] = useState<number | undefined>();

    const calculateTransactionFee = async (values: FormProps) => {
      const wallet = wallets.find((wallet) => wallet.address === address);
      const tx = {
        from: wallet.address,
        to: values.address,
      };
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await web3.eth.estimateGas(tx);
      const transactionFee = Number(
        web3.utils.fromWei(
          (Number(gasPrice) * gasLimit * holding?.currentPrice).toString(),
          "ether"
        )
      );
      const usdAmount = Number(values.amount) * holding?.currentPrice;
      const maxTotal = transactionFee + usdAmount;
      return {
        transactionFee,
        maxTotal,
        usdAmount,
      };
    };

    const onReview = async () => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const formData = formRef.current?.values;
        formRef.current?.setTouched({ amount: true, address: true });
        const { transactionFee, maxTotal, usdAmount } = await calculateTransactionFee(formData);
        setTransactionFee(transactionFee);
        setMaxTotal(maxTotal);
        setUsdAmount(usdAmount);
        setReviewVisible(true);
      } catch (e) {
        Alert.alert(e.message);
        console.log(e.message);
      }
    };

    const onSubmit = async (values: FormProps) => {
      if (!values.amount || !values.address) {
        return;
      }
      try {
        setLoading(true);
        const wallet = wallets.find((wallet) => wallet.address === address);
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
              console.log(error.message);
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
              Clipboard.setString(hash);
              dispatch(
                setToastMessages({
                  toastMessages: [
                    ...toastMessages,
                    "The hash of your transaction is copied to your clipboard",
                  ],
                })
              );
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
            bottom: insets.bottom,
          }}
        >
          <View style={{}}>
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
                    <View
                      style={{
                        backgroundColor: COLORS.gray,
                        padding: SIZES.padding,
                        borderRadius: SIZES.radius,
                        borderWidth: 1,
                        borderColor: COLORS.lightGray,
                        marginTop: SIZES.padding,
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 1, color: COLORS.white }}>{"Asset"}</Text>
                        <Text style={{ flex: 1, color: COLORS.white }}>{"Ethereum (ETH)"}</Text>
                      </View>
                      <View
                        style={{ height: 2, backgroundColor: COLORS.lightGray, marginVertical: 10 }}
                      />
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 1, color: COLORS.white }}>{"Amount"}</Text>
                        <Text
                          style={{ flex: 1, color: COLORS.white }}
                        >{`≈ ${CurrencyFormatter.format(usdAmount)}`}</Text>
                      </View>
                      <View
                        style={{ height: 2, backgroundColor: COLORS.lightGray, marginVertical: 10 }}
                      />
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 1, color: COLORS.white }}>{"Transaction Fee"}</Text>
                        <Text style={{ flex: 1, color: COLORS.white }}>
                          {`≈ ${CurrencyFormatter.format(transactionFee)}`}
                        </Text>
                      </View>
                      <View
                        style={{ height: 2, backgroundColor: COLORS.lightGray, marginVertical: 10 }}
                      />
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ flex: 1, color: COLORS.white }}>{"Max Total"}</Text>
                        <Text style={{ flex: 1, color: COLORS.white }}>
                          {`≈ ${CurrencyFormatter.format(maxTotal)}`}
                        </Text>
                      </View>
                    </View>
                  )}
                  {maxTotal > holding.total && (
                    <View
                      style={{
                        padding: SIZES.radius,
                        backgroundColor: "#560319",
                        borderRadius: SIZES.radius,
                        borderColor: COLORS.red,
                        borderWidth: 1,
                        marginTop: SIZES.padding,
                        opacity: 0.7,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[FONTS.h3, { color: COLORS.red }]}>
                        {"You don't have enough ETH to cover the fees."}
                      </Text>
                    </View>
                  )}
                  {reviewVisible ? (
                    <Button
                      type={"bordered"}
                      label={"Reset"}
                      onPress={() => {
                        setReviewVisible(false);
                        formRef.current?.resetForm();
                        setTransactionFee(undefined);
                        setUsdAmount(undefined);
                        setMaxTotal(undefined);
                      }}
                      style={{ marginTop: SIZES.padding }}
                    />
                  ) : (
                    <Button
                      type={"bordered"}
                      label={"Review"}
                      loading={loading}
                      onPress={onReview}
                      style={{ marginTop: SIZES.padding }}
                    />
                  )}
                  <Button
                    type={"bordered"}
                    label={"Send"}
                    loading={loading}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      handleSubmit();
                    }}
                    disabled={maxTotal > holding.total || !reviewVisible}
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
