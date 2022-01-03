import React from "react";
import { Image, StyleProp, Text, View, ViewStyle } from "react-native";

import { COLORS, FONTS, icons, SIZES } from "../constants";
import { CurrencyFormatter } from "../util";

import FadeInView from "./FadeInView";

type BalanceInfoProps = {
  readonly title: string;
  readonly displayAmount: number;
  readonly changePercentage: number;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly colors: ReactNativePaper.ThemeColors;
};

const BalanceInfo = ({
  title,
  displayAmount,
  changePercentage,
  containerStyle,
  colors,
}: BalanceInfoProps) => {
  return (
    <View style={[{}, containerStyle]}>
      {/* Title */}
      <FadeInView>
        <Text style={[FONTS.h3, { color: COLORS.lightGray3 }]}>{title}</Text>
      </FadeInView>
      {/* Figures */}
      <View
        style={{
          alignItems: "flex-end",
          flexDirection: "row",
        }}
      >
        <Text style={[FONTS.h2, { color: colors.text }]}>
          {CurrencyFormatter.format(displayAmount)}
        </Text>
        <Text style={[FONTS.h3, { color: COLORS.lightGray3 }]}>{" USD"}</Text>
      </View>
      {/* Change Precentage */}
      <FadeInView
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {changePercentage && changePercentage !== 0 && (
          <Image
            source={icons.upArrow}
            style={{
              width: 10,
              height: 10,
              alignSelf: "center",
              tintColor: changePercentage > 0 ? colors.success : colors.error,
              transform: changePercentage > 0 ? [{ rotate: "45deg" }] : [{ rotate: "125deg" }],
            }}
          />
        )}
        {changePercentage && (
          <>
            <Text
              style={[
                FONTS.h4,
                {
                  marginLeft: SIZES.base,
                  alignSelf: "flex-end",
                  color: changePercentage > 0 ? colors.success : colors.error,
                },
              ]}
            >{`${changePercentage.toFixed(2)}%`}</Text>

            <Text
              style={[
                FONTS.h5,
                {
                  marginLeft: SIZES.radius,
                  alignSelf: "flex-end",
                  color: COLORS.lightGray3,
                },
              ]}
            >
              {"7d change"}
            </Text>
          </>
        )}
      </FadeInView>
    </View>
  );
};

export default BalanceInfo;
