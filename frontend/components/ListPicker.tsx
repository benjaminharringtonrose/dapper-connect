import * as React from "react";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, SIZES } from "../constants";

import { ModalHeader } from "./ModalHeader";

export interface ListPickerProps {
  items: Array<any>;
  headerTitle?: string;
  onBack: () => void;
  onSelect: (value: any) => void;
  itemContainerStyle?: StyleProp<ViewStyle>;
}

export const ListPicker = React.forwardRef((props: ListPickerProps, ref) => {
  const insets = useSafeAreaInsets();

  const renderCells = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.onSelect(item);
        }}
        style={[
          {
            minHeight: 50,
            alignItems: "flex-end",
            paddingHorizontal: SIZES.base,
            paddingVertical: 10,
            justifyContent: "center",
          },
          props.itemContainerStyle,
        ]}
      >
        <Text style={{ color: COLORS.white }}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={ref as React.Ref<Modalize>}
        disableScrollIfPossible={true}
        adjustToContentHeight={true}
        HeaderComponent={() => (
          <ModalHeader
            title={props.headerTitle || "Select Item"}
            showCloseButton={true}
            onClose={props.onBack}
          />
        )}
        flatListProps={{
          ListFooterComponentStyle: { height: insets.bottom },
          data: props.items,
          renderItem: renderCells,
          ItemSeparatorComponent: Separator,
          keyExtractor: (item) => item.toString(),
          contentContainerStyle: { paddingBottom: insets.bottom },
          style: { backgroundColor: COLORS.black },
        }}
      />
    </Portal>
  );
});

const Separator = () => {
  return <View style={{ height: 1, backgroundColor: COLORS.gray1 }} />;
};
