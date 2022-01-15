import React from "react";
import { Image, StyleProp, Text, View, ViewStyle } from "react-native";

import { FONTS, icons, SIZES } from "../constants";
import { CurrencyFormatter } from "../util";

import Blockie from "./Blockie";
import FadeInView from "./FadeInView";

interface BalanceInfoProps {
  readonly title: string;
  readonly displayAmount: number;
  readonly changePercentage: number;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly colors: ReactNativePaper.ThemeColors;
  readonly address: string;
}

const BalanceInfo = ({
  title,
  displayAmount,
  changePercentage,
  containerStyle,
  colors,
  address,
}: BalanceInfoProps) => {
  return (
    <View style={[{}, containerStyle]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          {/* Title */}
          <FadeInView>
            <Text style={[FONTS.body3, { color: colors.text }]}>{title}</Text>
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
            <Text style={[FONTS.h3, { color: colors.textGray }]}>{" USD"}</Text>
          </View>
          {/* Change Precentage */}
          <FadeInView
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            {!!changePercentage && changePercentage !== 0 && (
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
            {!!changePercentage && (
              <>
                <Text
                  style={[
                    FONTS.body4,
                    {
                      marginLeft: SIZES.base,
                      alignSelf: "flex-end",
                      color: changePercentage > 0 ? colors.success : colors.error,
                    },
                  ]}
                >{`${changePercentage.toFixed(2)}%`}</Text>

                <Text
                  style={[
                    FONTS.body5,
                    {
                      marginLeft: SIZES.radius,
                      alignSelf: "flex-end",
                      color: colors.textGray,
                    },
                  ]}
                >
                  {"7d change"}
                </Text>
              </>
            )}
          </FadeInView>
        </View>
        <Blockie seed={address} size={7} scale={7} />
      </View>
    </View>
  );
};

export default BalanceInfo;
