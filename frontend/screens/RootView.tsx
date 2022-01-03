import React from "react";
import { SafeAreaView, StyleProp, View, ViewStyle } from "react-native";

import { Toast } from "../components/Toast";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setToastMessages } from "../store/settings/slice";

const RootView = ({ style, children }: { style?: StyleProp<ViewStyle>; children: JSX.Element }) => {
  const { toastMessages } = useAppSelector((state) => state.settings);

  const dispatch = useAppDispatch();

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
    </SafeAreaView>
  );
};

export default RootView;
