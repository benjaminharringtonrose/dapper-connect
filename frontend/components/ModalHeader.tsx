import * as React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

import { COLORS } from "../constants";

export interface ModalHeaderProps {
  title: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  showDoneButton?: boolean;
  onDone?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.black,
        },
        props.style,
      ]}
    >
      <View
        style={{
          width: 100,
        }}
      >
        {/* {props.showCloseButton && (
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              alignItems: "center",
            }}
            onPress={props.onClose}
          >
            <Icon name={"close"} color={colors.icon} size={24} />
          </TouchableOpacity>
        )} */}
      </View>
      <View
        style={{
          flex: 1,
          // marginHorizontal: spacings.xsmall,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "600", color: COLORS.white }}>{props.title}</Text>
      </View>
      {/* <View
        style={{
          width: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.showDoneButton && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <NavigationTextButton label={"Done"} onPress={props.onDone} />
          </View>
        )}
      </View> */}
    </View>
  );
};
