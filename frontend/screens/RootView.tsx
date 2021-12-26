import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { IconTextButton } from "../components";
import { COLORS, icons, SIZES } from "../constants";
import { useAppSelector } from "../hooks";

const RootView = ({ children }: { children: JSX.Element }) => {
  const modalAnimatedValue = useRef(new Animated.Value(0)).current;
  const { isTradeModalVisible } = useAppSelector((state) => state.tabs);

  useEffect(() => {
    if (isTradeModalVisible) {
      Animated.timing(modalAnimatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(modalAnimatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [isTradeModalVisible]);

  const modalY = modalAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SIZES.height, SIZES.height - 375],
  });

  return (
    <View style={{ flex: 1 }}>
      {children}
      {isTradeModalVisible && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.transparentBlack,
            opacity: modalAnimatedValue,
          }}
        />
      )}
      <Animated.View
        style={{
          position: "absolute",
          top: modalY,
          width: "100%",
          padding: SIZES.padding,
          backgroundColor: COLORS.primary,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <IconTextButton
          label={"Transfer"}
          icon={icons.send}
          onPress={() => console.log("Transfer")}
        />
        <IconTextButton
          label={"Withdraw"}
          icon={icons.withdraw}
          containerStyle={{
            marginTop: SIZES.base,
          }}
          onPress={() => console.log("Withdraw")}
        />
      </Animated.View>
    </View>
  );
};

export default RootView;
