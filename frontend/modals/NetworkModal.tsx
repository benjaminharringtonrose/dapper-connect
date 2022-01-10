import { AntDesign } from "@expo/vector-icons";
import React, { forwardRef, Ref } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { secureStore } from "../classes";
import { SectionTitle } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch } from "../hooks";
import { frontloadAppRequested, setNetwork } from "../store/settings/slice";
import { Network } from "../types";

interface NetworkModalProps {
  network: Network;
  onClose: () => void;
  colors: ReactNativePaper.ThemeColors;
}

export const NetworkModal = forwardRef((props: NetworkModalProps, ref: Ref<Modalize>) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  return (
    <Portal>
      <Modalize
        ref={ref}
        adjustToContentHeight={true}
        useNativeDriver={false}
        modalStyle={{ backgroundColor: props.colors.modal }}
        flatListProps={{
          keyExtractor: (item) => item.id,
          data: [
            { id: "mainnet", name: "Mainnet" },
            { id: "kovan", name: "Kovan (test network)" },
          ],
          ListHeaderComponent: () => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: SIZES.padding,
                  paddingVertical: SIZES.radius,
                  borderBottomColor: COLORS.lightGray,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              >
                <Text
                  style={[FONTS.body2, { flex: 4, color: props.colors.text, textAlign: "center" }]}
                >
                  {"Networks"}
                </Text>
              </View>
            );
          },
          renderItem: ({ item }) => {
            const selected = item.id === props.network;
            return (
              <TouchableOpacity
                onPress={async () => {
                  dispatch(setNetwork({ network: item.id }));
                  await secureStore.setNetwork(item.id);
                  dispatch(frontloadAppRequested());
                  props.onClose();
                }}
                style={{
                  flexDirection: "row",
                  minHeight: 50,
                  borderColor: COLORS.gray,
                  borderBottomWidth: 1,
                  padding: SIZES.padding,
                }}
              >
                <Text style={[FONTS.h4, { flex: 1, color: COLORS.white }]}>{item.name}</Text>
                {selected && (
                  <AntDesign name={"checksquare"} size={20} color={props.colors.success} />
                )}
              </TouchableOpacity>
            );
          },
          ListFooterComponent: (
            <View style={{ backgroundColor: props.colors.modal, paddingBottom: insets.bottom }} />
          ),
        }}
      />
    </Portal>
  );
});
