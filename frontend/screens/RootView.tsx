import React, { useEffect, useRef } from "react";
import { Animated, SafeAreaView, StyleProp, View, ViewStyle } from "react-native";

import { IconTextButton } from "../components";
import { Toast } from "../components/Toast";
import { COLORS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setToastMessages } from "../store/settings/slice";

const RootView = ({ style, children }: { style: StyleProp<ViewStyle>; children: JSX.Element }) => {
  const modalAnimatedValue = useRef(new Animated.Value(0)).current;
  const { isTradeModalVisible } = useAppSelector((state) => state.tabs);
  const { toastMessages } = useAppSelector((state) => state.settings);

  const dispatch = useAppDispatch();

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
    <SafeAreaView style={[{ flex: 1 }, style]}>
      {children}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {toastMessages.map((message) => (
          <Toast
            key={message}
            message={message}
            onHide={() => {
              const messages = toastMessages.filter((currentMessage) => currentMessage !== message);
              dispatch(setToastMessages({ toastMessages: messages }));
            }}
          />
        ))}
      </View>
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
    </SafeAreaView>
  );
};

export default RootView;
