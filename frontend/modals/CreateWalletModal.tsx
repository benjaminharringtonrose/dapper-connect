import { addHexPrefix, toChecksumAddress } from "ethereumjs-util";
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
import { COLORS, PEACE_COLORS, SIZES } from "../constants";
import {
  deriveAccountFromMnemonic,
  getAddressInDeviceStorage,
  getNextIndexInDeviceStorage,
  getPrivateKey,
  getSeedPhrase,
  saveNextIndex,
} from "../helpers";
import { useAppDispatch } from "../hooks";
import { getAccountRequested } from "../store/account";
import { addWalletRequested } from "../store/wallet";
import { DapperWallet } from "../types";

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

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
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
          backgroundColor: COLORS.black,
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

export const createNextWallet = async (name: string) => {
  const nextIndex = await getNextIndexInDeviceStorage();
  const address = await getAddressInDeviceStorage();
  const { privateKey } = await getPrivateKey(address);
  const { seedPhrase } = await getSeedPhrase(privateKey);
  const { wallet } = deriveAccountFromMnemonic(seedPhrase as string, nextIndex);
  const walletColor = PEACE_COLORS[Math.floor(Math.random() * PEACE_COLORS.length)];
  const walletAddress = addHexPrefix(toChecksumAddress(wallet.getAddress().toString("hex")));
  const walletPkey = addHexPrefix(wallet.getPrivateKey().toString("hex"));
  await saveNextIndex(nextIndex + 1);
  const nextDapperWallet: DapperWallet = {
    name,
    color: walletColor,
    address: walletAddress,
    privateKey: walletPkey,
    provider: "local",
    primary: false,
  };
  return nextDapperWallet;
};
