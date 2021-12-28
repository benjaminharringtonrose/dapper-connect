import React, { forwardRef, Ref } from "react";
import { Dimensions, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "../components/Button";
import { COLORS, SIZES } from "../constants";

export const WalletModal = forwardRef(
  (
    {
      create,
      connect,
      load,
    }: {
      create: () => void;
      connect: () => void;
      load: () => void;
    },
    ref: Ref<Modalize>
  ) => {
    const insets = useSafeAreaInsets();

    return (
      <Portal>
        <Modalize
          ref={ref}
          adjustToContentHeight={true}
          useNativeDriver={false}
          modalStyle={{ backgroundColor: COLORS.black, bottom: insets.bottom }}
        >
          <View>
            <Button
              label={"Create new wallet"}
              onPress={create}
              style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}
            />
            <Button label={"Load wallet"} onPress={load} style={{ margin: SIZES.padding }} />
            <Button
              label={"Add existing wallet"}
              onPress={connect}
              style={{ marginHorizontal: SIZES.padding }}
            />
          </View>
        </Modalize>
      </Portal>
    );
  }
);
