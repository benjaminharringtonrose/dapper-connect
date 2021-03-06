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
import * as Yup from "yup";

import { web3 } from "../api/web3";
import { Button, FormInput } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setToastMessages } from "../store/settings";
import { CurrencyFormatter } from "../util";

interface FormProps {
  amount?: string;
  address?: string;
}

interface SendModalProps {
  onPress: () => void;
  address: string;
  colors: ReactNativePaper.ThemeColors;
}

export const SendModal = forwardRef((props: SendModalProps, ref: Ref<Modalize>) => {
  const formRef = React.useRef<FormikProps<FormProps>>(null);

  const ValidationSchema = Yup.object().shape({
    amount: Yup.string().required("required"),
    address: Yup.string().required("required"),
  });

  const dispatch = useAppDispatch();
  const connector = useWalletConnect();
  const insets = useSafeAreaInsets();
  const { toastMessages } = useAppSelector((state) => state.settings);
  const { holdings } = useAppSelector((state) => state.market);
  const holding = holdings.find((holding) => holding.id === "ethereum");
  const { accounts } = useAppSelector((state) => state.wallets);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingReview, setLoadingReview] = useState<boolean>(false);
  const [reviewVisible, setReviewVisible] = useState<boolean>(false);
  const [transactionFee, setTransactionFee] = useState<number | undefined>();
  const [maxTotal, setMaxTotal] = useState<number | undefined>();
  const [usdAmount, setUsdAmount] = useState<number | undefined>();

  const calculateTransactionFee = async (values: FormProps) => {
    const account = accounts.find((wallet) => wallet.address === props.address);
    const tx = {
      from: account.address,
      to: values.address,
    };
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = await web3.eth.estimateGas(tx);
    const transactionFee = Number(
      web3.utils.fromWei((Number(gasPrice) * gasLimit * holding?.currentPrice).toString(), "ether")
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
      setLoadingReview(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const formData = formRef.current?.values;
      formRef.current?.setTouched({ amount: true, address: true });
      if (!formData?.address || !formData?.amount) {
        return;
      }
      const { transactionFee, maxTotal, usdAmount } = await calculateTransactionFee(formData);
      setTransactionFee(transactionFee);
      setMaxTotal(maxTotal);
      setUsdAmount(usdAmount);
      setReviewVisible(true);
    } catch (e) {
      Alert.alert(e.message);
      console.log(e.message);
    } finally {
      setLoadingReview(false);
    }
  };

  const onSubmit = async (values: FormProps) => {
    if (!values.amount || !values.address) {
      return;
    }
    try {
      setLoading(true);
      const account = accounts.find((wallet) => wallet.address === props.address);
      const wei = web3.utils.toWei(values.amount, "ether");
      if (account.provider === "walletconnect") {
        if (connector.connected) {
          try {
            await connector.sendTransaction({
              data: "0x",
              from: account?.address,
              to: values.address,
              value: web3.utils.numberToHex(Number(wei)),
            });
            console.log("success");
          } catch (error) {
            console.log(error.message);
          }
        }
      } else if (account.provider === "local") {
        const tx = {
          data: "0x",
          from: account?.address,
          to: values.address,
          value: web3.utils.numberToHex(Number(wei)),
        };
        const gasLimit = await web3.eth.estimateGas(tx);

        const signedTx = await web3.eth.accounts.signTransaction(
          {
            ...tx,
            gas: gasLimit,
          },
          account.privateKey
        );
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
          if (!error) {
            console.log("???? The hash of your transaction is: ", hash);
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
            console.log("???Something went wrong while submitting your transaction:", error);
          }
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.warn(error.message);
    }
    formRef.current?.resetForm();
    props.onPress();
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
        <View style={{}}>
          <Formik
            innerRef={formRef}
            initialValues={{
              amount: undefined,
              address: undefined,
            }}
            validationSchema={ValidationSchema}
            onSubmit={onSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
              <View style={{ margin: SIZES.padding }}>
                <View
                  style={{
                    backgroundColor: props.colors.input,
                    borderRadius: SIZES.radius,
                    borderWidth: 1,
                    borderColor: props.colors.border,
                    padding: SIZES.padding,
                  }}
                >
                  <FormInput
                    label={"Amount"}
                    placeholder={"0"}
                    onChangeText={handleChange("amount")}
                    onBlur={handleBlur("amount")}
                    keyboardType={"decimal-pad"}
                    autoCorrect={true}
                    value={values.amount}
                    error={errors.amount}
                    touched={touched.amount}
                    inputStyle={{ flex: 1 }}
                    colors={props.colors}
                    noBorder
                  />
                  <View
                    style={{ height: 2, backgroundColor: props.colors.border, marginVertical: 10 }}
                  />
                  <FormInput
                    label={"Address"}
                    placeholder={"0xbc28Ea04....."}
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
                        <Feather name={"clipboard"} size={24} color={props.colors.primary} />
                      </TouchableOpacity>
                    )}
                    colors={props.colors}
                    noBorder
                  />
                </View>
                {reviewVisible && (
                  <View
                    style={{
                      backgroundColor: props.colors.input,
                      padding: SIZES.padding,
                      borderRadius: SIZES.radius,
                      borderWidth: 1,
                      borderColor: props.colors.border,
                      marginTop: SIZES.padding,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ flex: 1, color: props.colors.text }}>{"Asset"}</Text>
                      <Text style={{ flex: 1, color: props.colors.text }}>{"Ethereum (ETH)"}</Text>
                    </View>
                    <View
                      style={{
                        height: 2,
                        backgroundColor: props.colors.border,
                        marginVertical: 10,
                      }}
                    />
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ flex: 1, color: props.colors.text }}>{"Amount"}</Text>
                      <Text
                        style={{ flex: 1, color: props.colors.text }}
                      >{`??? ${CurrencyFormatter.format(usdAmount)}`}</Text>
                    </View>
                    <View
                      style={{
                        height: 2,
                        backgroundColor: props.colors.border,
                        marginVertical: 10,
                      }}
                    />
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ flex: 1, color: props.colors.text }}>{"Transaction Fee"}</Text>
                      <Text style={{ flex: 1, color: props.colors.text }}>
                        {`??? ${CurrencyFormatter.format(transactionFee)}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 2,
                        backgroundColor: props.colors.border,
                        marginVertical: 10,
                      }}
                    />
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ flex: 1, color: props.colors.text }}>{"Max Total"}</Text>
                      <Text style={{ flex: 1, color: props.colors.text }}>
                        {`??? ${CurrencyFormatter.format(maxTotal)}`}
                      </Text>
                    </View>
                  </View>
                )}
                {maxTotal > holding.total && (
                  <View
                    style={{
                      padding: SIZES.radius,
                      backgroundColor: props.colors.error,
                      borderRadius: SIZES.radius,
                      marginTop: SIZES.padding,
                      opacity: 0.7,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={[FONTS.h3, { color: COLORS.white }]}>
                      {"You don't have enough ETH to cover the fees."}
                    </Text>
                  </View>
                )}
                {reviewVisible ? (
                  <Button
                    label={"Reset"}
                    onPress={() => {
                      setReviewVisible(false);
                      formRef.current?.resetForm();
                      setTransactionFee(undefined);
                      setUsdAmount(undefined);
                      setMaxTotal(undefined);
                    }}
                    style={{ marginTop: SIZES.padding }}
                    colors={props.colors}
                  />
                ) : (
                  <Button
                    label={"Review"}
                    loading={loadingReview}
                    onPress={onReview}
                    style={{ marginTop: SIZES.padding }}
                    colors={props.colors}
                  />
                )}
                <Button
                  label={"Send"}
                  loading={loading}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    await handleSubmit();
                  }}
                  disabled={maxTotal > holding.total || !reviewVisible}
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
});
