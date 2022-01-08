import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, Ref, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, PeaceArt, SectionTitle } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAccountRequested } from "../store/account";
import { removeWalletRequested } from "../store/wallet";

interface WalletModalProps {
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

export const WalletModal = forwardRef((props: WalletModalProps, ref: Ref<Modalize>) => {
  const anim = useRef(new Animated.Value(0)).current;
  const { wallets } = useAppSelector((state) => state.wallets);
  const wallet = wallets?.find((wallet) => wallet.address === props.address);

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
        useNativeDriver={false}
        flatListProps={{
          keyExtractor: (item) => item.address,
          data: wallets,
          ListHeaderComponent: () => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: SIZES.padding,
                  paddingVertical: SIZES.radius,
                  borderBottomColor: props.colors.border,
                  borderBottomWidth: 1,
                }}
              >
                <SectionTitle title={"Wallets"} />
                <TouchableOpacity onPress={() => setEditMode(!editMode)}>
                  <Text style={[FONTS.h3, { color: props.colors.primary }]}>{"Edit"}</Text>
                </TouchableOpacity>
              </View>
            );
          },
          renderItem: ({ item }) => {
            const selected = props.address === item.address;
            return (
              <View style={{ flexDirection: "row" }}>
                {/* Wallet Item */}
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
                    padding: SIZES.padding,
                    flexDirection: "row",
                    alignItems: "center",
                    width,
                  }}
                >
                  <View style={{ paddingRight: SIZES.radius }}>
                    <PeaceArt selectedColor={item.color} colors={props.colors} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[FONTS.h3, { color: props.colors.text }]}>{item?.name}</Text>
                    <Text style={[FONTS.h5, { color: props.colors.textGray }]}>
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
                      "Are you sure you want to delete this wallet?",
                      "Your wallet data will be deleted from the app. Make sure to hold on to your address and private key if you still need them.",
                      [
                        {
                          text: "Delete",
                          onPress: () => {
                            dispatch(removeWalletRequested({ address: item?.address }));
                            if (item?.address === props.address) {
                              props.onResetSelectedAddress();
                              dispatch(getAccountRequested({ address: wallets[0]?.address }));
                            } else {
                              dispatch(getAccountRequested({ address: props.address }));
                            }
                            if (wallet.provider === "walletconnect") {
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
              <>
                <Button
                  type={"bordered"}
                  label={"Create new wallet"}
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
              </>
            );
          },
        }}
        modalStyle={{
          bottom: insets.bottom,
          backgroundColor: props.colors.background,
        }}
        handleStyle={{ backgroundColor: props.colors.modalHandle }}
      />
    </Portal>
  );
});
