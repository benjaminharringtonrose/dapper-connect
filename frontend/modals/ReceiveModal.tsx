import { Feather } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import * as Haptics from "expo-haptics";
import React, { forwardRef, Ref } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, FONTS, SIZES } from "../constants";
import { useAppSelector } from "../hooks";

export const ReceiveModal = forwardRef(
  ({ onPress }: { onPress: () => void }, ref: Ref<Modalize>) => {
    const { user } = useAppSelector((state) => state.account);
    const insets = useSafeAreaInsets();

    return (
      <Portal>
        <Modalize
          ref={ref}
          useNativeDriver={false}
          adjustToContentHeight={true}
          modalStyle={{
            backgroundColor: COLORS.black,
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginTop: SIZES.padding,
              height: Dimensions.get("screen").height / 2,
            }}
          >
            <QRCode value={user.walletAddress} size={200} />
            <View style={{ paddingVertical: SIZES.padding }}>
              <Text
                style={[FONTS.h4, { color: COLORS.lightGray3, width: 200, textAlign: "center" }]}
              >
                {user.walletAddress}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Clipboard.setString(user.walletAddress);
                onPress();
              }}
              style={{
                backgroundColor: COLORS.gray,
                padding: SIZES.radius,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLORS.lightGray,
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="copy" size={24} color={COLORS.white} />
              <Text style={[FONTS.h5, { color: COLORS.white }]}>{"Copy"}</Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Portal>
    );
  }
);
