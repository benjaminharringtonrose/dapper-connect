import React, { useState } from "react";
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";

import { Chart, TextButton } from "../components";
import { COLORS, FONTS, icons, SIZES } from "../constants";
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
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.radius,
        }}
      >
        <TextButton
          label={"1D"}
          onPress={onSelectOneDay}
          containerStyle={{
            backgroundColor: selectedNumDays === Days.one ? COLORS.lightGray : COLORS.gray1,
          }}
        />
        <TextButton
          label={"1W"}
          onPress={onSelectOneWeek}
          containerStyle={{
            backgroundColor: selectedNumDays === Days.seven ? COLORS.lightGray : COLORS.gray1,
          }}
        />
        <TextButton
          label={"1M"}
          onPress={onSelectOneMonth}
          containerStyle={{
            backgroundColor: selectedNumDays === Days.thirty ? COLORS.lightGray : COLORS.gray1,
          }}
        />
        <TextButton
          label={"1Y"}
          onPress={onSelectOneYear}
          containerStyle={{
            backgroundColor:
              selectedNumDays === Days.threeHundredAndSixtyFive ? COLORS.lightGray : COLORS.gray1,
          }}
        />
      </View>
    );
  };

  return (
    <RootView style={{ backgroundColor: COLORS.black }}>
      <>
        <View style={{ paddingBottom: SIZES.radius }}>
          {/* Chart */}
          {!!sparkline[0][0] && <Chart containerStyle={{}} chartPrices={sparkline} />}
          {renderButtons()}
        </View>
        {/* Top Cryptocurrency */}
        <FlatList
          data={coins}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ marginTop: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshingHomeScreen}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
            />
          }
          renderItem={({ item }) => {
            const priceChangePercentage = getPriceChangePercentageInCurrency(item, selectedNumDays);
            const priceColor = getPriceColor(priceChangePercentage);
            const backgroundColor = item?.id === selectedId ? COLORS.gray : COLORS.black;
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
                  <Text style={[FONTS.h3, { color: COLORS.white }]}>{item.name}</Text>
                </View>
                {/* Figures */}
                <View>
                  <Text style={[FONTS.h4, { textAlign: "right", color: COLORS.white }]}>
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
