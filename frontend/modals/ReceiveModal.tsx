import { Feather } from "@expo/vector-icons";
import React, { forwardRef, Ref } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import QRCode from "react-native-qrcode-svg";

import { COLORS, FONTS, SIZES } from "../constants";

export const ReceiveModal = forwardRef(
  ({ onPress, address }: { onPress: () => void; address: string }, ref: Ref<Modalize>) => {
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
            <QRCode value={address} size={200} />
            <View style={{ paddingVertical: SIZES.padding }}>
              <Text
                style={[FONTS.h4, { color: COLORS.lightGray3, width: 200, textAlign: "center" }]}
              >
                {address}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onPress}
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
