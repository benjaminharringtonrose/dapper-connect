import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import React, { forwardRef, Ref } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, SectionTitle } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppSelector } from "../hooks";

interface WalletModalProps {
  address: string;
  onCreate: () => void;
  onWalletConnect: () => void;
  onSelectWallet: (address: string) => void;
}

export const WalletModal = forwardRef(
  (
    { address, onCreate, onWalletConnect, onSelectWallet }: WalletModalProps,
    ref: Ref<Modalize>
  ) => {
    const insets = useSafeAreaInsets();
    const { wallets } = useAppSelector((state) => state.wallets);

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
                  }}
                >
                  <SectionTitle title={"WALLETS"} />
                  <TouchableOpacity>
                    {/* <FontAwesome name={"trash"} color={COLORS.white} size={25} /> */}
                    <Text style={[FONTS.h3, { color: COLORS.white }]}>{"Edit"}</Text>
                  </TouchableOpacity>
                </View>
              );
            },
            renderItem: ({ item }) => {
              const selected = address === item.address;
              return (
                <TouchableOpacity
                  onPress={() => onSelectWallet(item?.address)}
                  style={{
                    minHeight: 50,
                    borderColor: COLORS.gray,
                    borderBottomWidth: 1,
                    padding: SIZES.padding,
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[FONTS.h3, { color: COLORS.white }]}>{item?.name}</Text>
                    <Text style={[FONTS.h5, { color: COLORS.lightGray3 }]}>
                      {`${String(item?.address).substring(0, 10)}...`}
                    </Text>
                  </View>
                  {selected && (
                    <AntDesign name={"checksquare"} size={20} color={COLORS.lightGreen} />
                  )}
                </TouchableOpacity>
              );
            },
            ListFooterComponent: () => {
              return (
                <>
                  <Button
                    label={"Create new wallet"}
                    onPress={onCreate}
                    style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding }}
                  />
                  <Button
                    label={"WalletConnect"}
                    onPress={onWalletConnect}
                    style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding }}
                  />
                </>
              );
            },
          }}
          modalStyle={{
            bottom: insets.bottom,
            backgroundColor: COLORS.black,
            borderTopStartRadius: 25,
            borderTopEndRadius: 25,
          }}
        />
      </Portal>
    );
  }
);
