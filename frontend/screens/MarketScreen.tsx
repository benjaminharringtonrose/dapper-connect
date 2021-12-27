/* eslint-disable @typescript-eslint/no-empty-function */
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { HeaderBar, TextButton } from "../components";
import { FadeInView } from "../components/FadeInView";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getExchangesRequested } from "../store/exchange/slice";
import { getCoinMarketRequested } from "../store/market/slice";

import RootView from "./RootView";

const MarketScreen = () => {
  const { coins, loadingGetCoinMarket } = useAppSelector((state) => state.market);
  const { exchanges, loadingGetExchanges } = useAppSelector((state) => state.exchange);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const dispatch = useAppDispatch();

  const onRefresh = () => {
    dispatch(getCoinMarketRequested({}));
    dispatch(getExchangesRequested());
  };

  const renderButtons = () => {
    return (
      <View
        style={{ flexDirection: "row", marginTop: SIZES.radius, marginHorizontal: SIZES.radius }}
      >
        <TextButton label={"USD"} onPress={() => {}} />
        <TextButton containerStyle={{ marginLeft: SIZES.base }} label={"% 7d"} onPress={() => {}} />
        <TextButton containerStyle={{ marginLeft: SIZES.base }} label={"Top"} onPress={() => {}} />
      </View>
    );
  };

  const renderCryptoList = () => {
    return (
      <View style={{ flex: 1, width: SIZES.width }}>
        <FlatList
          data={coins}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loadingGetCoinMarket || loadingGetExchanges}
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
            return (
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: SIZES.padding,
                  marginBottom: SIZES.radius,
                }}
              >
                {/* Coins */}
                <View style={{ flex: 1.5, flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: item.image }} style={{ height: 20, width: 20 }} />
                  <Text style={[FONTS.h3, { marginLeft: SIZES.radius, color: COLORS.white }]}>
                    {item.name}
                  </Text>
                </View>
                {/* Line Chart */}
                <View style={{ flex: 1, alignItems: "center" }}>
                  <LineChart
                    withVerticalLabels={false}
                    withHorizontalLabels={false}
                    withDots={false}
                    withInnerLines={false}
                    withVerticalLines={false}
                    withOuterLines={false}
                    data={{
                      labels: [],
                      datasets: [
                        {
                          data: item.sparkline_in_7d.price,
                        },
                      ],
                    }}
                    width={100}
                    height={60}
                    chartConfig={{ color: () => priceColor, strokeWidth: 1.5 }}
                    bezier
                    style={{ paddingRight: 0 }}
                  />
                </View>
                {/* Figures */}
                <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
                  <Text style={[FONTS.h4, { color: COLORS.white }]}>
                    {`$ ${item.current_price}`}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
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
                    <Text style={[FONTS.h3, { marginLeft: 5, color: priceColor }]}>
                      {`${item.price_change_percentage_7d_in_currency.toFixed(2)}%`}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  const renderExchangesList = () => {
    return (
      <View style={{ flex: 1, width: SIZES.width }}>
        <FlatList
          data={exchanges}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loadingGetCoinMarket || loadingGetExchanges}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
            />
          }
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: SIZES.padding,
                  paddingVertical: SIZES.radius,
                  minHeight: 40,
                }}
              >
                {/* Coins */}
                <View style={{ flex: 1.5, flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: item.image }} style={{ height: 20, width: 20 }} />
                  <Text style={[FONTS.h3, { marginLeft: SIZES.radius, color: COLORS.white }]}>
                    {item.name}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  return (
    <RootView>
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        <View style={{ marginHorizontal: SIZES.padding }}>
          {/* Header */}
          <HeaderBar title={"Market"} />
          {/* Tab Bar */}
          <SegmentedControl
            values={["Cyptocurrencies", "Exchanges"]}
            selectedIndex={selectedIndex}
            onChange={(event) => {
              onRefresh();
              setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            style={{ backgroundColor: COLORS.lightGray }}
            tabStyle={{ backgroundColor: COLORS.gray }}
            activeFontStyle={{ color: COLORS.black }}
            fontStyle={{ color: COLORS.white }}
          />
          {/* Buttons */}
          {renderButtons()}
        </View>
        {/* Market List */}
        <FadeInView>{selectedIndex === 0 ? renderCryptoList() : renderExchangesList()}</FadeInView>
      </View>
    </RootView>
  );
};

export default MarketScreen;
