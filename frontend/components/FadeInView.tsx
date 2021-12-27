import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
export const FadeInView = ({ children }: { children: React.ReactNode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn();
  }, []);

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return <Animated.View style={{ flex: 1, opacity: fadeAnim }}>{children}</Animated.View>;
};
