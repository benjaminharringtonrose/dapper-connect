/* eslint-disable react-native/no-color-literals */
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
} from "@rainbow-me/animated-charts";
import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

import { COLORS, FONTS, SIZES } from "../constants";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Chart = ({ containerStyle, chartPrices }) => {
  const { colors } = useTheme();

  const data = chartPrices
    ? chartPrices?.map((item) => {
        return {
          x: item[0],
          y: item[1],
        };
      })
    : [];

  const points = monotoneCubicInterpolation({ data, range: 200 });

  const formatUSD = (value) => {
    "worklet";
    if (value === "") {
      return "";
    }
    return `$${Number(value).toFixed(2)}`;
  };

  const formatDateTime = (value) => {
    "worklet";
    if (value === "") {
      return "";
    }
    const selectedDate = new Date(Number(value));

    const month = MONTHS[selectedDate.getMonth()];
    let day = selectedDate.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    const year = selectedDate.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const formatNumber = (value, roundingPoint) => {
    if (value > 1e9) {
      return `$${(value / 1e9).toFixed(roundingPoint)}B`;
    } else if (value > 1e6) {
      return `$${(value / 1e6).toFixed(roundingPoint)}M`;
    } else if (value > 1e3) {
      return `$${(value / 1e3).toFixed(roundingPoint)}K`;
    } else {
      return value.toFixed(roundingPoint);
    }
  };

  const getYAxisLabelValues = () => {
    if (chartPrices !== undefined) {
      const y = chartPrices?.map((price) => price[1]);
      const minValue = Math.min(...y);
      const maxValue = Math.max(...y);
      const midValue = (minValue + maxValue) / 2;
      const higherMidValue = (maxValue + midValue) / 2;
      const lowerMidValue = (midValue + minValue) / 2;

      const roundingPoint = 2;

      return [
        formatNumber(maxValue, roundingPoint),
        formatNumber(higherMidValue, roundingPoint),
        formatNumber(lowerMidValue, roundingPoint),
        formatNumber(minValue, roundingPoint),
      ];
    } else {
      return [];
    }
  };

  return (
    <View
      style={[
        containerStyle,
        {
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: SIZES.radius,
        },
      ]}
    >
      {/* Y-Axis Label */}
      <View
        style={{
          position: "absolute",
          left: SIZES.padding,
          top: 0,
          bottom: 0,
          justifyContent: "space-between",
        }}
      >
        {/* getYAxisLabelValues */}
        {getYAxisLabelValues().map((item, index) => {
          return (
            <Text key={index} style={[FONTS.body5, { color: COLORS.lightGray3 }]}>
              {item}
            </Text>
          );
        })}
      </View>
      {/* Chart */}
      {points.length > 0 && (
        <ChartPathProvider data={{ points, smoothingStrategy: "bezier" }}>
          <ChartPath
            height={150}
            width={SIZES.width - SIZES.radius * 2}
            stroke={colors.primary}
            strokeWidth={2}
          />
          <ChartDot>
            <View
              style={{
                position: "absolute",
                left: -35,
                width: 80,
                alignItems: "center",
                backgroundColor: COLORS.transparentBlack,
              }}
            >
              {/* Dot */}
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 25,
                  height: 25,
                  borderRadius: 15,
                  backgroundColor: COLORS.white,
                }}
              >
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 10,
                    backgroundColor: "blue",
                  }}
                />
              </View>
              {/* Y-Label */}
              <ChartYLabel format={formatUSD} style={[FONTS.body5, { color: COLORS.white }]} />
              {/* X-Label */}
              <ChartXLabel
                format={formatDateTime}
                style={[
                  FONTS.body5,
                  {
                    marginTop: 3,
                    color: COLORS.lightGray3,
                    lineHeight: 15,
                  },
                ]}
              />
            </View>
          </ChartDot>
        </ChartPathProvider>
      )}
    </View>
  );
};

export default Chart;
