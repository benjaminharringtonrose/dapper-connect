import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

const FadeInView = ({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn();
  });

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  return <Animated.View style={[{ opacity: fadeAnim }, style]}>{children}</Animated.View>;
};

export default FadeInView;
