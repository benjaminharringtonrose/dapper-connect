import { Feather } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import firestore from "@react-native-firebase/firestore";
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
import { getAccountRequested } from "../store/account/slice";

interface FormProps {
  name?: string;
}

export const CreateWalletModal = forwardRef(
  ({ onPress, web3 }: { onPress: () => void; web3: Web3 }, ref: Ref<Modalize>) => {
    const formRef = React.useRef<FormikProps<FormProps>>(null);

    const ProfileSchema = Yup.object().shape({
      name: Yup.string().required("Required"),
    });

    const { user } = useAppSelector((state) => state.account);
    const dispatch = useAppDispatch();
    const connector = useWalletConnect();
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (values: FormProps) => {
      if (!values.name) {
        return;
      }
      try {
        setLoading(true);
        create(values);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.warn(error.message);
      }
      onPress();
    };

    const create = async (values: FormProps) => {
      try {
        onPress();
        const account = web3.eth.accounts.create(web3.utils.randomHex(32));
        const wallet = web3.eth.accounts.wallet.add(account);
        const password = web3.utils.randomHex(32);
        const keystore = wallet.encrypt(password);
        await firestore()
          .collection("users")
          .doc(user.uid)
          .set(
            {
              wallets: {
                [wallet.address]: {
                  name: values.name,
                  address: wallet.address,
                  privateKey: wallet.privateKey,
                  provider: "local",
                  password: password,
                  keystore: keystore,
                },
              },
            },
            { merge: true }
          );
        dispatch(getAccountRequested({ address: wallet.address }));
      } catch (error) {
        console.warn(error);
      }
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
          <View>
            <Formik
              innerRef={formRef}
              initialValues={{
                name: undefined,
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
