/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { HeaderBar, TextButton } from "../components";
import { COLORS, constants, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getCoinMarketRequested } from "../store/market/slice";
import { MeasureLayout } from "../types";

import MainLayout from "./MainLayout";

const marketTabs = constants.marketTabs.map((marketTab) => ({
  ...marketTab,
  ref: React.createRef<any>(),
}));

const TabIndicator = ({
  measureLayout,
  scrollX,
}: {
  measureLayout: MeasureLayout[];
  scrollX: Animated.Value;
}) => {
  const inputRange = marketTabs.map((_, i) => i * SIZES.width);

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map((measure) => measure.x),
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        height: "100%",
        width: (SIZES.width - SIZES.radius * 2) / 2,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.lightGray,
        transform: [{ translateX }],
      }}
    />
  );
};

const Tabs = ({
  scrollX,
  onPress,
}: {
  scrollX: Animated.Value;
  onPress: (marketTabIndex: number) => void;
}) => {
  const [measureLayout, setMeasureLayout] = useState<MeasureLayout[]>([]);
  const containerRef = useRef<View>(null);

  useEffect(() => {
    const ml: MeasureLayout[] = [];
    marketTabs.forEach((marketTab) => {
      marketTab?.ref?.current?.measureLayout(
        containerRef.current,
        (x: number, y: number, width: number, height: number) => {
          ml.push({ x, y, width, height });

          if (ml.length === marketTabs.length) {
            setMeasureLayout(ml);
          }
        }
      );
    });
  }, [containerRef.current]);

  return (
    <View ref={containerRef} style={{ flexDirection: "row" }}>
      {/* Tab Indicator */}
      {measureLayout.length > 0 && <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />}
      {/* Tabs */}
      {marketTabs.map((item, index) => {
        return (
          <TouchableOpacity
            key={`MarketTab-${index}`}
            style={{ flex: 1 }}
            onPress={() => onPress(index)}
          >
            <View
              ref={item.ref}
              style={{
                paddingHorizontal: 15,
                alignItems: "center",
                justifyContent: "center",
                height: 40,
              }}
            >
              <Text style={[FONTS.h3, { color: COLORS.white }]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MarketScreen = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const marketTabScrollViewRef = useRef<FlatList>(null);

  const { coins } = useAppSelector((state) => state.market);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCoinMarketRequested({}));
  }, []);

  const onMarketTabPress = useCallback((marketTabIndex) => {
    marketTabScrollViewRef.current?.scrollToOffset({
      offset: marketTabIndex * SIZES.width,
    });
  }, []);

  const renderTabBar = () => {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.gray,
        }}
      >
        <Tabs scrollX={scrollX} onPress={onMarketTabPress} />
      </View>
    );
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

  const renderList = () => {
    return (
      <Animated.FlatList
        ref={marketTabScrollViewRef}
        data={marketTabs}
        contentContainerStyle={{ marginTop: SIZES.padding }}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { x: scrollX } },
            },
          ],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          return (
            <View style={{ flex: 1, width: SIZES.width }}>
              <FlatList
                data={coins}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
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
        }}
      />
    );
  };

  return (
    <MainLayout>
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        {/* Header */}
        <HeaderBar title={"Market"} />
        {/* Tab Bar */}
        {renderTabBar()}
        {/* Buttons */}
        {renderButtons()}
        {/* Market List */}
        {renderList()}
      </View>
    </MainLayout>
  );
};

export default MarketScreen;
