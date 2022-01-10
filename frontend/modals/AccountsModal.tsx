import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "../components";
import Blockie from "../components/Blockie";
import { FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAccountRequested } from "../store/account";
import { removeAccountRequested } from "../store/wallet";

interface AccountsModalProps {
  colors: ReactNativePaper.ThemeColors;
  address: string;
  connector: any;
  onCreate: () => void;
  onWalletConnect: () => void;
  onSelectWallet: (address: string) => void;
  onResetSelectedAddress: () => void;
  onClose: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const { width } = Dimensions.get("screen");

export const AccountsModal = forwardRef((props: AccountsModalProps, ref: Ref<Modalize>) => {
  const anim = useRef(new Animated.Value(0)).current;
  const { accounts } = useAppSelector((state) => state.wallets);
  const account = accounts?.find((wallet) => wallet.address === props.address);

  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (editMode) {
      onEdit();
    } else {
      onView();
    }
  }, [editMode]);

  const onEdit = () => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onView = () => {
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Portal>
      <Modalize
        ref={ref}
        adjustToContentHeight={true}
        useNativeDriver={true}
        flatListProps={{
          showsVerticalScrollIndicator: false,
          keyExtractor: (item) => item.address,
          data: accounts,
          ListHeaderComponent: () => {
            return (
              <View
                style={{
                  flex: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomColor: props.colors.border,
                  borderBottomWidth: 1,
                  paddingVertical: SIZES.radius,
                }}
              >
                <View style={{ flex: 2, paddingLeft: SIZES.padding }} />
                <Text
                  style={[FONTS.body2, { flex: 4, color: props.colors.text, textAlign: "center" }]}
                >
                  {"Accounts"}
                </Text>
                <TouchableOpacity
                  style={{
                    flex: 2,
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingVertical: SIZES.radius,
                    paddingRight: SIZES.padding,
                  }}
                  onPress={() => setEditMode(!editMode)}
                >
                  <Text
                    style={[
                      FONTS.h3,
                      {
                        color: props.colors.primary,
                      },
                    ]}
                  >
                    {"Edit"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          },
          renderItem: ({ item }) => {
            const selected = props.address === item.address;
            return (
              <View style={{ flexDirection: "row" }}>
                {/* Account Item */}
                <AnimatedTouchable
                  onPress={() => props.onSelectWallet(item?.address)}
                  style={{
                    transform: [
                      {
                        translateX: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -50],
                        }),
                      },
                    ],
                    minHeight: 50,
                    borderColor: props.colors.border,
                    borderBottomWidth: 1,
                    paddingHorizontal: SIZES.padding,
                    paddingVertical: SIZES.radius,
                    flexDirection: "row",
                    alignItems: "center",
                    width,
                  }}
                >
                  <View style={{ paddingRight: SIZES.padding }}>
                    <View style={{ borderRadius: 64 / 2, overflow: "hidden" }}>
                      <Blockie seed={item.address} size={7} scale={7} />
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[FONTS.body3, { color: props.colors.text }]}>{item?.name}</Text>
                    <Text style={[FONTS.body5, { color: props.colors.textGray }]}>
                      {`${String(item?.address).substring(0, 10)}...`}
                    </Text>
                  </View>
                  {selected && (
                    <AntDesign name={"checksquare"} size={20} color={props.colors.success} />
                  )}
                </AnimatedTouchable>
                {/* Delete Wallet Button */}
                <AnimatedTouchable
                  onPress={() => {
                    Alert.alert(
                      "Are you sure you want to delete this account?",
                      "Your account data will be deleted from the app. Make sure to hold on to your address and private key if you still need them.",
                      [
                        {
                          text: "Delete",
                          onPress: () => {
                            dispatch(removeAccountRequested({ address: item?.address }));
                            if (item?.address === props.address) {
                              props.onResetSelectedAddress();
                              dispatch(getAccountRequested({ address: accounts[0]?.address }));
                            } else {
                              dispatch(getAccountRequested({ address: props.address }));
                            }
                            if (account.provider === "walletconnect") {
                              props.connector.killSession();
                            }
                            setEditMode(!editMode);
                          },
                          style: "destructive",
                        },
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  }}
                  style={{
                    transform: [
                      {
                        translateX: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -50],
                        }),
                      },
                    ],
                    minHeight: 50,
                    width: 50,
                    borderColor: props.colors.border,
                    borderBottomWidth: 1,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={"ios-trash"} size={20} color={props.colors.error} />
                </AnimatedTouchable>
              </View>
            );
          },
          ListFooterComponent: () => {
            return (
              <View style={{ backgroundColor: props.colors.modal }}>
                <Button
                  type={"bordered"}
                  label={"Create Account"}
                  onPress={props.onCreate}
                  style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding }}
                  colors={props.colors}
                />
                <Button
                  type={"bordered"}
                  label={"WalletConnect"}
                  onPress={props.onWalletConnect}
                  style={{ marginVertical: SIZES.radius, marginHorizontal: SIZES.padding }}
                  colors={props.colors}
                />
                <View
                  style={{ backgroundColor: props.colors.modal, paddingBottom: insets.bottom }}
                />
              </View>
            );
          },
        }}
        modalStyle={{ backgroundColor: props.colors.modal }}
        handleStyle={{ backgroundColor: props.colors.modalHandle }}
      />
    </Portal>
  );
});
