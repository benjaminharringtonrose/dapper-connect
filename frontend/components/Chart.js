import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  ChartXLabel,
  ChartYLabel,
  monotoneCubicInterpolation,
} from "@rainbow-me/animated-charts";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";

import { COLORS, FONTS, SIZES } from "../constants";

const Chart = ({ containerStyle, chartPrices }) => {
  // Points
  const startUnixTimestamp = moment().subtract(7, "day").unix();
  const data = chartPrices
    ? chartPrices?.map((item, index) => {
        return {
          x: startUnixTimestamp + (index + 1) * 3600,
          y: item,
        };
      })
    : [];
  const points = monotoneCubicInterpolation({ data, range: 40 });

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
    var selectedDate = new Date(value * 1000);
    const date = `0${selectedDate.getDate()}`.slice(-2);
    const month = `0${selectedDate.getMonth() + 1}`.slice(-2);
    return `${month}/${date}`;
  };

  const formatNumber = (value, roundingPoint) => {
    if (value > 1e9) {
      return `${(value / 1e9).toFixed(roundingPoint)}B`;
    } else if (value > 1e6) {
      return `${(value / 1e6).toFixed(roundingPoint)}M`;
    } else if (value > 1e3) {
      return `${(value / 1e3).toFixed(roundingPoint)}K`;
    } else {
      return value.toFixed(roundingPoint);
    }
  };

  const getYAxisLabelValues = () => {
    if (chartPrices !== undefined) {
      const minValue = Math.min(...chartPrices);
      const maxValue = Math.max(...chartPrices);
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
          borderColor: COLORS.gray1,
          borderWidth: 1,
          borderRadius: 25,
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
      {data.length > 0 && (
        <ChartPathProvider data={{ points, smoothingStrategy: "bezier" }}>
          <ChartPath height={150} width={SIZES.width} stroke={COLORS.lightGreen} strokeWidth={2} />
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
                    backgroundColor: COLORS.lightGreen,
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
