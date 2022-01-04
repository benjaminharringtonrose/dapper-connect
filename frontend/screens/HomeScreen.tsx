import { authenticateAsync, hasHardwareAsync, isEnrolledAsync } from "expo-local-authentication";
import React, { useState } from "react";
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

import { Chart, TextButton } from "../components";
import { FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useErrors } from "../hooks";
import { getSparklineRequested } from "../store/market";
import { refreshHomeScreenRequested } from "../store/market/slice";
import { Days, Interval } from "../types";
import { CurrencyFormatter, getPriceChangePercentageInCurrency, getPriceColor } from "../util";

import RootView from "./RootView";

const HomeScreen = () => {
  const {
    coins,
    sparkline,
    errorGetCoinMarket,
    errorGetSparkline,
    refreshingHomeScreen,
  } = useAppSelector((state) => state.market);
  const dispatch = useAppDispatch();

  const { colors } = useTheme();

  const [selectedId, setSelectedId] = useState<string>(coins[0]?.id);
  const [selectedNumDays, setSelectedNumDays] = useState<Days>(Days.one);
  const [selectedInterval, setSelectedInterval] = useState<Interval>(Interval.minutely);

  useErrors([errorGetCoinMarket, errorGetSparkline]);

  const onSelectOneDay = () => {
    setSelectedNumDays(Days.one);
    setSelectedInterval(Interval.minutely);
    dispatch(
      getSparklineRequested({
        id: selectedId,
        days: Days.one,
        interval: Interval.minutely,
      })
    );
  };

  const onSelectOneWeek = () => {
    setSelectedNumDays(Days.seven);
    setSelectedInterval(Interval.hourly);
    dispatch(
      getSparklineRequested({
        id: selectedId,
        days: Days.seven,
        interval: Interval.hourly,
      })
    );
  };

  const onSelectOneMonth = () => {
    setSelectedNumDays(Days.thirty);
    setSelectedInterval(Interval.hourly);
    dispatch(
      getSparklineRequested({
        id: selectedId,
        days: Days.thirty,
        interval: Interval.hourly,
      })
    );
  };

  const onSelectOneYear = () => {
    setSelectedNumDays(Days.threeHundredAndSixtyFive);
    setSelectedInterval(Interval.hourly);
    dispatch(
      getSparklineRequested({
        id: selectedId,
        days: Days.threeHundredAndSixtyFive,
        interval: Interval.hourly,
      })
    );
  };

  const onRefresh = () => {
    dispatch(
      refreshHomeScreenRequested({
        id: selectedId,
        days: selectedNumDays,
        interval: selectedInterval,
      })
    );
  };

  const renderButtons = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: SIZES.padding,
          marginHorizontal: SIZES.radius,
        }}
      >
        <TextButton
          label={"1D"}
          onPress={onSelectOneDay}
          containerStyle={{
            backgroundColor: selectedNumDays === Days.one ? colors.primary : colors.accent,
          }}
          textStyle={{
            color: selectedNumDays === Days.one ? colors.background : colors.text,
          }}
          colors={colors}
        />
        <TextButton
          label={"1W"}
          onPress={onSelectOneWeek}
          containerStyle={{
            backgroundColor: selectedNumDays === Days.seven ? colors.primary : colors.accent,
          }}
          textStyle={{
            color: selectedNumDays === Days.seven ? colors.background : colors.text,
          }}
          colors={colors}
        />
        <TextButton
          label={"1M"}
          onPress={onSelectOneMonth}
          containerStyle={{
            backgroundColor: selectedNumDays === Days.thirty ? colors.primary : colors.accent,
          }}
          textStyle={{
            color: selectedNumDays === Days.thirty ? colors.background : colors.text,
          }}
          colors={colors}
        />
        <TextButton
          label={"1Y"}
          onPress={onSelectOneYear}
          containerStyle={{
            backgroundColor:
              selectedNumDays === Days.threeHundredAndSixtyFive ? colors.primary : colors.accent,
          }}
          textStyle={{
            color:
              selectedNumDays === Days.threeHundredAndSixtyFive ? colors.background : colors.text,
          }}
          colors={colors}
        />
      </View>
    );
  };

  return (
    <RootView>
      <>
        <View
          style={{
            paddingVertical: SIZES.radius,
          }}
        >
          {/* Chart */}
          {!!sparkline[0][0] && (
            <Chart
              containerStyle={{ marginHorizontal: SIZES.radius, marginBottom: SIZES.padding }}
              chartPrices={sparkline}
            />
          )}
          {renderButtons()}
        </View>
        {/* Top Cryptocurrency */}
        <FlatList
          data={coins}
          keyExtractor={(item) => item.id}
          style={{
            paddingTop: 20,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshingHomeScreen}
              onRefresh={onRefresh}
              tintColor={colors.activityIndicator}
            />
          }
          renderItem={({ item }) => {
            const priceChangePercentage = getPriceChangePercentageInCurrency(item, selectedNumDays);
            const priceColor = getPriceColor(priceChangePercentage, colors);
            const backgroundColor = item?.id === selectedId ? colors.accent : colors.background;
            return (
              <TouchableOpacity
                style={{
                  height: 55,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor,
                  paddingHorizontal: SIZES.padding,
                }}
                onPress={() => {
                  setSelectedId(item.id);
                  dispatch(
                    getSparklineRequested({
                      id: item.id,
                      days: selectedNumDays,
                      interval: selectedInterval,
                    })
                  );
                }}
              >
                {/* Logo */}
                <View style={{ width: 35 }}>
                  <Image source={{ uri: item.image }} style={{ height: 20, width: 20 }} />
                </View>
                {/* Name */}
                <View style={{ flex: 1 }}>
                  <Text style={[FONTS.h3, { color: colors.text }]}>{item.name}</Text>
                </View>
                {/* Figures */}
                <View>
                  <Text style={[FONTS.h4, { textAlign: "right", color: colors.text }]}>
                    {CurrencyFormatter.format(item.current_price)}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {priceChangePercentage !== 0 && (
                      <Image
                        source={icons.upArrow}
                        style={{
                          height: 10,
                          width: 10,
                          tintColor: priceColor,
                          transform:
                            priceChangePercentage > 0
                              ? [{ rotate: "45deg" }]
                              : [{ rotate: "125deg" }],
                        }}
                      />
                    )}

                    <Text
                      style={[FONTS.body5, { marginLeft: 5, color: priceColor, lineHeight: 15 }]}
                    >{`${priceChangePercentage?.toFixed(2)}%`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
        />
      </>
    </RootView>
  );
};

export default HomeScreen;
