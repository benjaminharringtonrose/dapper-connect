import React, { forwardRef, Ref } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import Web3 from "web3";

import { Button } from "../components/Button";
import { COLORS, FONTS, SIZES } from "../constants";
import { User } from "../types";

export const LoadWalletModal = forwardRef(
  (
    {
      user,
      web3,
      onSelectWallet,
    }: { user: User; web3: Web3; onSelectWallet: (address: string) => void },
    ref: Ref<Modalize>
  ) => {
    return (
      <Portal>
        <Modalize
          ref={ref}
          adjustToContentHeight={true}
          useNativeDriver={false}
          flatListProps={{
            keyExtractor: (item) => item.address,
            data: user?.wallets,
            renderItem: ({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => onSelectWallet(item?.address)}
                  style={{
                    minHeight: 50,
                    borderColor: COLORS.gray,
                    borderBottomWidth: 1,
                    justifyContent: "center",
                    padding: SIZES.padding,
                  }}
                >
                  <Text style={[FONTS.h3, { color: COLORS.white }]}>{item?.name}</Text>
                  <Text style={[FONTS.h5, { color: COLORS.lightGray3 }]}>{item?.address}</Text>
                </TouchableOpacity>
              );
            },
          }}
          modalStyle={{
            bottom: 50,
            backgroundColor: COLORS.black,
            borderTopStartRadius: 25,
            borderTopEndRadius: 25,
          }}
        />
      </Portal>
    );
  }
);