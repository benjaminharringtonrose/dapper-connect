import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
export const FadeInView = ({
  style,
  children,
}: {
  style: ViewStyle;
  children: React.ReactNode;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn();
  });

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return <Animated.View style={[{ flex: 1, opacity: fadeAnim }, style]}>{children}</Animated.View>;
};
