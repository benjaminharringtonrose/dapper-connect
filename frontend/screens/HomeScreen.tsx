import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Web3 from "web3";

import { Chart } from "../components";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getCoinMarketRequested, resetHoldings } from "../store/market/slice";
import { Coin } from "../types";

import MainLayout from "./MainLayout";

const HomeScreen = () => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | undefined>(undefined);
  const {
    coins,
    loadingGetCoinMarket,
    // errorGetCoinMarket,
  } = useAppSelector((state) => state.market);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigation.setOptions({
      title: "DapperWallet",
    });
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(getCoinMarketRequested({}));
    }, [])
  );

  const onRefresh = () => {
    dispatch(getCoinMarketRequested({}));
  };

  return (
    <MainLayout>
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        <View style={{ paddingBottom: SIZES.radius }}>
          {/* Chart */}
          <Chart
            containerStyle={{ marginTop: SIZES.padding * 2 }}
            chartPrices={
              selectedCoin ? selectedCoin?.sparkline_in_7d?.price : coins[0]?.sparkline_in_7d.price
            }
          />
        </View>
        <View style={{ marginVertical: SIZES.radius }}>
          <Text style={[FONTS.h3, { fontSize: 18, color: COLORS.white }]}>
            {"Top Cryptocurrency"}
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
          ListHeaderComponent={<></>}
          renderItem={({ item }) => {
            const priceColor =
              item.price_change_percentage_7d_in_currency === 0
                ? COLORS.lightGray3
                : item.price_change_percentage_7d_in_currency > 0
                ? COLORS.lightGreen
                : COLORS.red;
            const backgroundColor = item?.id === selectedCoin?.id ? COLORS.gray : COLORS.black;
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
                onPress={() => setSelectedCoin(item)}
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
    </MainLayout>
  );
};

export default HomeScreen;
