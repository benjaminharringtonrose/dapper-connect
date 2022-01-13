import React, { forwardRef, Ref } from "react";
import { Text, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";

interface ReceiveModalProps {
  onPress: () => void;
  address: string;
  colors: ReactNativePaper.ThemeColors;
}

export const ReceiveModal = forwardRef((props: ReceiveModalProps, ref: Ref<Modalize>) => {
  const insets = useSafeAreaInsets();

  return (
    <Portal>
      <Modalize
        ref={ref}
        useNativeDriver={false}
        adjustToContentHeight={true}
        modalStyle={{ backgroundColor: props.colors.modal }}
        handleStyle={{ backgroundColor: props.colors.modalHandle }}
      >
        <View
          style={{
            alignItems: "center",
            marginTop: SIZES.padding,
          }}
        >
          <QRCode value={props.address} size={200} />
          <View style={{ paddingVertical: SIZES.padding }}>
            <Text style={[FONTS.h4, { color: props.colors.text, width: 200, textAlign: "center" }]}>
              {props.address}
            </Text>
          </View>
        </View>
        <Button
          label={"Copy"}
          postfixIcon={"copy"}
          onPress={props.onPress}
          style={{ marginHorizontal: SIZES.padding, marginBottom: SIZES.radius }}
          colors={props.colors}
        />
        <View style={{ backgroundColor: props.colors.modal, paddingBottom: insets.bottom }} />
      </Modalize>
    </Portal>
  );
});
