import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, Image, View } from "react-native";
import { useTheme } from "react-native-paper";

import { COLORS, FONTS, icons, SIZES } from "../constants";

export const StartupScreen = () => {
  const { colors } = useTheme();

  const anim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.black,
      }}
    >
      <Animated.View
        style={{
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-SIZES.height / 2 + 60, -60],
              }),
            },
          ],
        }}
      >
        <Image
          source={icons.wallet}
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
          }}
        />
      </Animated.View>

      <Animated.Text
        style={[
          FONTS.h1,
          {
            opacity,
            color: COLORS.white,
            position: "absolute",
            transform: [
              {
                translateY: opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0],
                }),
              },
            ],
          },
        ]}
      >
        {"DapperConnect"}
      </Animated.Text>
      <Animated.View style={{ opacity }}>
        <ActivityIndicator size={"large"} color={colors.activityIndicator} />
      </Animated.View>
    </View>
  );
};
