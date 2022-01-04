/* eslint-disable react-native/no-color-literals */
import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";

import { COLORS, FONTS, SIZES } from "../constants";

export const getRandomMessage = () => {
  const number = Math.trunc(Math.random() * 10000);
  return "Random message " + number;
};

export const Toast = (props) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start(() => {
      props.onHide();
    });
  }, []);

  return (
    <Animated.View
      style={{
        opacity: 0.7,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -100],
            }),
          },
        ],
        marginBottom: 5,
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: SIZES.radius,
        paddingVertical: 15,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
        borderRadius: SIZES.radius,
      }}
    >
      <Text style={[FONTS.h4, { color: COLORS.white }]}>{props.message}</Text>
    </Animated.View>
  );
};
