import { Feather } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import * as Haptics from "expo-haptics";
import { Formik, FormikProps } from "formik";
import React, { forwardRef, Ref, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";

import { Button, FormInput } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { CurrencyFormatter } from "../util";

interface FormProps {
  input?: string;
  output?: string;
}

interface SwapModalProps {
  onPress: () => void;
  address: string;
  colors: ReactNativePaper.ThemeColors;
}

export const SwapModal = forwardRef((props: SwapModalProps, ref: Ref<Modalize>) => {
  const formRef = React.useRef<FormikProps<FormProps>>(null);

  const ValidationSchema = Yup.object().shape({
    input: Yup.string().required("required"),
    output: Yup.string().required("required"),
  });

  const insets = useSafeAreaInsets();
  const { holdings } = useAppSelector((state) => state.market);
  const holding = holdings.find((holding) => holding.id === "ethereum");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingReview, setLoadingReview] = useState<boolean>(false);
  const [reviewVisible, setReviewVisible] = useState<boolean>(false);
  const [transactionFee, setTransactionFee] = useState<number | undefined>();
  const [maxTotal, setMaxTotal] = useState<number | undefined>();
  const [usdAmount, setUsdAmount] = useState<number | undefined>();

  const onReview = async () => {
    try {
      setLoadingReview(true);
      // review
      setReviewVisible(true);
    } catch (e) {
      Alert.alert(e.message);
      console.log(e.message);
    } finally {
      setLoadingReview(false);
    }
  };

  const onSubmit = async (values: FormProps) => {
    if (!values.input || !values.output) {
      return;
    }
    try {
      setLoading(true);
      // submit swap
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
                    label={"Convert"}
                    placeholder={"0"}
                    onChangeText={handleChange("input")}
                    onBlur={handleBlur("input")}
                    keyboardType={"decimal-pad"}
                    autoCorrect={true}
                    value={values.input}
                    error={errors.input}
                    touched={touched.input}
                    colors={props.colors}
                    noBorder
                    icon={() => (
                      <TouchableOpacity
                        style={{
                          backgroundColor: props.colors.white,
                          borderRadius: 25,
                          height: 50,
                          width: 50,
                        }}
                      >
                        <Image source={{ uri: holding.image }} style={{ height: 50, width: 50 }} />
                      </TouchableOpacity>
                    )}
                  />
                  <View
                    style={{
                      height: 2,
                      backgroundColor: props.colors.border,
                      marginVertical: SIZES.padding,
                    }}
                  />
                  <FormInput
                    label={"To"}
                    placeholder={"0"}
                    onChangeText={handleChange("output")}
                    onBlur={handleBlur("output")}
                    keyboardType={"decimal-pad"}
                    autoCorrect={true}
                    value={values.output}
                    error={errors.output}
                    touched={touched.output}
                    colors={props.colors}
                    noBorder
                    icon={() => (
                      <TouchableOpacity
                        style={{
                          backgroundColor: props.colors.white,
                          borderRadius: 25,
                          height: 50,
                          width: 50,
                        }}
                      >
                        <Image
                          source={{
                            uri: holdings?.find((holding) => holding.id === "chainlink")?.image,
                          }}
                          style={{ height: 50, width: 50 }}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </View>
                <Button
                  label={"Swap"}
                  loading={loading}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    await handleSubmit();
                  }}
                  disabled={false}
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
