import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";

import { Chart, TextButton } from "../components";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getCoinMarketRequested, getSparklineRequested } from "../store/market/slice";

import RootView from "./RootView";

const HomeScreen = () => {
  const {
    coins,
    loadingGetCoinMarket,
    errorGetCoinMarket,
    sparkline,
    errorGetSparkline,
  } = useAppSelector((state) => state.market);

  const dispatch = useAppDispatch();

  const [selectedId, setSelectedId] = useState<string>("bitcoin");
  const [selectedNumDays, setSelectedNumDays] = useState<string>("1");
  const [selectedInterval, setSelectedInterval] = useState<string>("minutely");

  useEffect(() => {
    if (errorGetCoinMarket || errorGetSparkline) {
      Alert.alert("An error occurred", errorGetCoinMarket.message);
    }
    if (errorGetSparkline) {
      Alert.alert("An error occurred", errorGetSparkline.message);
    }
  }, [errorGetCoinMarket, errorGetSparkline]);

  const onRefresh = () => {
    dispatch(getCoinMarketRequested({}));
    dispatch(
      getSparklineRequested({
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
          onPress={() => {
            setSelectedNumDays("1");
            setSelectedInterval("minutely");
            dispatch(getSparklineRequested({ id: selectedId, days: "1", interval: "minutely" }));
          }}
          containerStyle={{
            backgroundColor: selectedNumDays === "1" ? COLORS.lightGray : COLORS.gray1,
          }}
        />
        <TextButton
          label={"1W"}
          onPress={() => {
            setSelectedNumDays("7");
            setSelectedInterval("hourly");
            dispatch(getSparklineRequested({ id: selectedId, days: "7", interval: "hourly" }));
          }}
          containerStyle={{
            backgroundColor: selectedNumDays === "7" ? COLORS.lightGray : COLORS.gray1,
          }}
        />
        <TextButton
          label={"1M"}
          onPress={() => {
            setSelectedNumDays("30");
            setSelectedInterval("hourly");
            dispatch(getSparklineRequested({ id: selectedId, days: "30", interval: "hourly" }));
          }}
          containerStyle={{
            backgroundColor: selectedNumDays === "30" ? COLORS.lightGray : COLORS.gray1,
          }}
        />
        <TextButton
          label={"1Y"}
          onPress={() => {
            setSelectedNumDays("365");
            setSelectedInterval("hourly");
            dispatch(getSparklineRequested({ id: selectedId, days: "365", interval: "hourly" }));
          }}
          containerStyle={{
            backgroundColor: selectedNumDays === "365" ? COLORS.lightGray : COLORS.gray1,
          }}
        />
      </View>
    );
  };

  return (
    <RootView>
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        <View style={{ paddingBottom: SIZES.radius }}>
          {/* Chart */}
          <Chart containerStyle={{}} chartPrices={sparkline} />
          {renderButtons()}
        </View>
        <View style={{ marginVertical: SIZES.radius }}>
          <Text style={[FONTS.h3, { fontSize: 18, color: COLORS.white }]}>
            {"Popular Cryptocurrency"}
          </Text>
        </View>
        {/* Top Cryptocurrency */}
        <FlatList
          data={coins}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ marginTop: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={loadingGetCoinMarket}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
            />
          }
          renderItem={({ item }) => {
            const priceColor =
              item.price_change_percentage_7d_in_currency === 0
                ? COLORS.lightGray3
                : item.price_change_percentage_7d_in_currency > 0
                ? COLORS.lightGreen
                : COLORS.red;
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
                  <Text
                    style={[FONTS.h4, { textAlign: "right", color: COLORS.white }]}
                  >{`$ ${item.current_price}`}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {item.price_change_percentage_7d_in_currency !== 0 && (
                      <Image
                        source={icons.upArrow}
                        style={{
                          height: 10,
                          width: 10,
                          tintColor: priceColor,
                          transform:
                            item.price_change_percentage_7d_in_currency > 0
                              ? [{ rotate: "45deg" }]
                              : [{ rotate: "125deg" }],
                        }}
                      />
                    )}
                    <Text
                      style={[FONTS.body5, { marginLeft: 5, color: priceColor, lineHeight: 15 }]}
                    >{`${item.price_change_percentage_7d_in_currency.toFixed(2)}%`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
        />
      </View>
    </RootView>
  );
};

export default HomeScreen;
