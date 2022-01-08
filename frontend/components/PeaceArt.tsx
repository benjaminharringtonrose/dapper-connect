import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { COLORS } from "../constants";

const SIDE_WIDTH = 40;
const BLOCK_WIDTH = 2;

const iterWidth = new Array(SIDE_WIDTH);

const PeaceArt = ({
  selectedColor,
  colors,
}: {
  selectedColor: string;
  colors: ReactNativePaper.ThemeColors;
}) => {
  const OUTLINE = selectedColor || COLORS.white;
  return (
    <View style={{ backgroundColor: colors.modal, width: SIDE_WIDTH, height: SIDE_WIDTH }}>
      <Block color={OUTLINE} style={{ top: 6, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 6, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 8, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 10, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 12, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 14, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 16, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 16, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 14, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 12, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 10, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 14 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 8, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 6, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 4, left: 18 }} />
      <Block color={OUTLINE} style={{ top: 4, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 6, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 8, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 10, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 12, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 14, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 16, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 24 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 18 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 18 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 18 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 18 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 18 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 24 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 30, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 32, left: 24 }} />
      {/* <Block color={OUTLINE} style={{ top: 34, left: 24 }} /> */}
      <Block color={OUTLINE} style={{ top: 34, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 36, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 38, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 38, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 36, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 34, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 32, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 30, left: 4 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 4 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 4 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 4 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 8 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 16 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 14 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 12 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 10 }} />
      <Block color={OUTLINE} style={{ top: 20, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 22, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 24, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 26, left: 22 }} />
      <Block color={OUTLINE} style={{ top: 8, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 10, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 12, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 14, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 16, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 18, left: 6 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 24 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 26 }} />
      <Block color={OUTLINE} style={{ top: 28, left: 20 }} />
      <Block color={OUTLINE} style={{ top: 20.5, left: 18.5 }} />
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
