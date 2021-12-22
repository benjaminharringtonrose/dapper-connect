import { useFocusEffect } from "@react-navigation/native";
import { Formik, FormikProps } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import "@tensorflow/tfjs-react-native";

import { BalanceInfo, Chart } from "../components";
import { COLORS, FONTS, icons, mockData, SIZES } from "../constants";
import { mockHoldings } from "../constants/mock";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getHoldingsRequested } from "../store/market/slice";

import MainLayout from "./MainLayout";

interface ModelFormProps {
  optimizer?: string;
  learningRate?: number;
  epochs?: number;
  target?: number;
}

const PortfolioScreen = () => {
  const [selectedCoin, setSelectedCoin] = useState<any>(undefined);
  const { holdings, loadingGetHoldings } = useAppSelector((state) => state.market);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(getHoldingsRequested({ holdings: mockHoldings }));
    }, [])
  );

  const chartPrices = selectedCoin
    ? selectedCoin?.sparklineIn7d?.value
    : holdings[0]?.sparklineIn7d?.value;

  return (
    <MainLayout>
      <ScrollView>
        <View style={{ flex: 1, backgroundColor: COLORS.black }}>
          {/* Chart */}
          <Chart containerStyle={{ marginTop: SIZES.radius }} chartPrices={chartPrices} />
          {/* Assets */}
          <FlatList
            data={holdings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ marginTop: SIZES.padding, paddingHorizontal: SIZES.padding }}
            ListHeaderComponent={
              <View>
                {/* Section Title */}
                <Text style={[FONTS.h2, { color: COLORS.white }]}>{"Your Assets"}</Text>
                {/* Header Label */}
                <View style={{ flexDirection: "row", marginTop: SIZES.radius }}>
                  <Text style={{ flex: 1, color: COLORS.lightGray3 }}>{"Asset"}</Text>
                  <Text style={{ flex: 1, color: COLORS.lightGray3, textAlign: "right" }}>
                    {"Price"}
                  </Text>
                  <Text style={{ flex: 1, color: COLORS.lightGray3, textAlign: "right" }}>
                    {"Holdings"}
                  </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => {
              const priceColor =
                item.priceChangePercentageInCurrency7d === 0
                  ? COLORS.lightGray3
                  : item.priceChangePercentageInCurrency7d > 0
                  ? COLORS.lightGreen
                  : COLORS.red;
              return (
                <TouchableOpacity
                  style={{ flexDirection: "row", height: 55 }}
                  onPress={() => setSelectedCoin(item)}
                >
                  {/* Asset */}
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: item.image }} style={{ width: 20, height: 20 }} />
                    <Text style={[FONTS.h4, { marginLeft: SIZES.radius, color: COLORS.white }]}>
                      {item.name}
                    </Text>
                  </View>
                  {/* Price */}
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={[
                        FONTS.h4,
                        { textAlign: "right", color: COLORS.white, lineHeight: 15 },
                      ]}
                    >{`$${item.currentPrice.toLocaleString()}`}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      {item.priceChangePercentageInCurrency7d !== 0 && (
                        <Image
                          source={icons.upArrow}
                          style={{
                            height: 10,
                            width: 10,
                            tintColor: priceColor,
                            transform:
                              item.priceChangePercentageInCurrency7d > 0
                                ? [{ rotate: "45deg" }]
                                : [{ rotate: "125deg" }],
                          }}
                        />
                      )}
                      <Text
                        style={[FONTS.body5, { marginLeft: 5, color: priceColor, lineHeight: 15 }]}
                      >{`${item.priceChangePercentageInCurrency7d.toFixed(2)} %`}</Text>
                    </View>
                  </View>
                  {/* Holdings */}
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={[
                        FONTS.h4,
                        { textAlign: "right", color: COLORS.white, lineHeight: 15 },
                      ]}
                    >{`$ ${item.total.toLocaleString()}`}</Text>
                    <Text
                      style={[
                        FONTS.body5,
                        { textAlign: "right", color: COLORS.lightGray3, lineHeight: 15 },
                      ]}
                    >{`${item.qty} ${item.symbol}`}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default PortfolioScreen;
