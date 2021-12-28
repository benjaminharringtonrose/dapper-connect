import React, { forwardRef, Ref } from "react";
import { View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";

import { Button } from "../components/Button";
import { COLORS, SIZES } from "../constants";

export const WalletModal = forwardRef(
  ({ create, connect }: { create: () => void; connect: () => void }, ref: Ref<Modalize>) => {
    return (
      <Portal>
        <Modalize ref={ref} adjustToContentHeight={true} useNativeDriver={false}>
          <View style={{ minHeight: 200, backgroundColor: COLORS.black }}>
            <Button
              label={"Create new wallet"}
              onPress={create}
              style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}
            />
            <Button
              label={"Add existing wallet"}
              onPress={connect}
              style={{ margin: SIZES.padding }}
            />
          </View>
        </Modalize>
      </Portal>
    );
  }
);
