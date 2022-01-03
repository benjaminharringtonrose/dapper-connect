import { Feather } from "@expo/vector-icons";
import React, { forwardRef, Ref } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import QRCode from "react-native-qrcode-svg";

import { COLORS, FONTS, SIZES } from "../constants";

interface ReceiveModalProps {
  onPress: () => void;
  address: string;
  colors: ReactNativePaper.ThemeColors;
}

export const ReceiveModal = forwardRef((props: ReceiveModalProps, ref: Ref<Modalize>) => {
  return (
    <Portal>
      <Modalize
        ref={ref}
        useNativeDriver={false}
        adjustToContentHeight={true}
        modalStyle={{ backgroundColor: props.colors.background }}
      >
        <View
          style={{
            alignItems: "center",
            marginTop: SIZES.padding,
            height: Dimensions.get("screen").height / 2,
          }}
        >
          <QRCode value={props.address} size={200} />
          <View style={{ paddingVertical: SIZES.padding }}>
            <Text style={[FONTS.h4, { color: COLORS.lightGray3, width: 200, textAlign: "center" }]}>
              {props.address}
            </Text>
          </View>
          <TouchableOpacity
            onPress={props.onPress}
            style={{
              backgroundColor: props.colors.primary,
              padding: SIZES.radius,
              borderRadius: 10,
              width: 60,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="copy" size={24} color={props.colors.background} />
            <Text style={[FONTS.h5, { color: props.colors.background }]}>{"Copy"}</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </Portal>
  );
});
