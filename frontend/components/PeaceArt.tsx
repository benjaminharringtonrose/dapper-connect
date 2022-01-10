import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { COLORS, PEACE_COLORS } from "../constants";

const SIDE_WIDTH = 40;
const BLOCK_WIDTH = 2;

const iterWidth = new Array(SIDE_WIDTH);
// const randomColor = PEACE_COLORS[Math.floor(Math.random() * PEACE_COLORS.length)];

const PeaceArt = ({
  selectedColor,
  colors,
}: {
  selectedColor: string;
  colors: ReactNativePaper.ThemeColors;
}) => {
  const OUTLINE = selectedColor || COLORS.white;
  return (
    <View
      style={{
        backgroundColor: colors.modal,
        width: SIDE_WIDTH,
        height: SIDE_WIDTH,
        borderRadius: SIDE_WIDTH / 2,
        borderWidth: 2,
        padding: 20,
        borderColor: OUTLINE,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Block color={OUTLINE} style={{ top: 6, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 6, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 8, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 10, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 12, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 14, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 16, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 16, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 14, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 12, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 10, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 18 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 8, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 6, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 4, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 4, left: 24 }} />
      <Block color={OUTLINE} style={{ top: 6, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 8, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 10, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 12, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 14, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 16, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 28 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 24 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 10 }} />

      <Block color={OUTLINE} style={{ top: 20, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 28 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 30 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 30 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 30 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 30 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 30 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 30 }} />
      <Block color={OUTLINE} style={{ top: 30, left: 30 }} />
      <Block color={OUTLINE} style={{ top: 32, left: 28 }} />
      <Block color={OUTLINE} style={{ top: 34, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 36, left: 24 }} />
      <Block color={OUTLINE} style={{ top: 38, left: 24 }} />
      <Block color={OUTLINE} style={{ top: 38, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 36, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 34, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 32, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 30, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 14 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 18 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 14 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 8, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 10, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 12, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 14, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 16, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 810 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 28 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 30 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 24 }} />
      <Block color={OUTLINE} style={{ top: 20.5, left: 22.5 }} />
      <Block color={OUTLINE} style={{ top: 6, left: 14 }} />
    </View>
  );
};

const Block = ({ color, style }: { color: string; style: ViewStyle }) => {
  return (
    <View
      style={[
        { position: "absolute", width: BLOCK_WIDTH, height: BLOCK_WIDTH, backgroundColor: color },
        style,
      ]}
    />
  );
};

export default PeaceArt;
