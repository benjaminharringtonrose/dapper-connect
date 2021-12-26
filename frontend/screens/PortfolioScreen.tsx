import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Web3 from "web3";

import { BalanceInfo, Chart, IconTextButton } from "../components";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAccountRequested } from "../store/account/slice";
import { getSparklineRequested, resetHoldings } from "../store/market/slice";

import MainLayout from "./MainLayout";

const PortfolioScreen = () => {
  const [selectedCoin, setSelectedCoin] = useState<any>(undefined);

  const { holdings, loadingGetHoldings, sparkline } = useAppSelector((state) => state.market);
  const { account, loadingGetAccount } = useAppSelector((state) => state.account);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();

  // const provider = new Web3.providers.HttpProvider(
  //   "https://mainnet.infura.io/v3/7b9909b1c3ed4958a172e2ad2e6c66a3"
  // );
  // const web3: Web3 = new Web3(provider);

  useEffect(() => {
    navigation.setOptions({
      title: "DapperWallet",
      headerRight: () => (
        <TouchableOpacity>
          <Ionicons name={"wallet"} size={32} color={COLORS.white} onPress={() => connect()} />
        </TouchableOpacity>
      ),
    });
  });

  async function connect() {
    try {
      if (!connector.connected) {
        await connector.connect();
      } else {
        Alert.alert("Your wallet is already connected!", "", [
          {
            text: "Disconnect",
            onPress: () => {
              connector.killSession();
              dispatch(resetHoldings());
            },
          },
          { text: "Nevermind" },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useFocusEffect(
    useCallback(() => {
      dispatch(getSparklineRequested({ id: holdings[0]?.id, days: "7", interval: "hourly" }));
    }, [])
  );

  useEffect(() => {
    if (connector.connected) {
      dispatch(getAccountRequested({ address: connector.accounts[0] }));
    }
  }, [connector.connected]);

  const totalWallet = holdings?.reduce((a, b) => a + (b.total || 0), 0);
  const valueChange = holdings?.reduce((a, b) => a + (b.holdingValueChange7d || 0), 0);
  const percentageChange = valueChange
    ? (valueChange / (totalWallet - valueChange)) * 100
    : undefined;

  function renderWalletInfoSection() {
    return (
      <View
        style={{
          paddingTop: SIZES.padding,
          paddingHorizontal: SIZES.padding,
          borderRadius: 25,
          borderWidth: 1,
          borderColor: COLORS.gray,
          backgroundColor: COLORS.black,
        }}
      >
        {/* Balance Info */}
        <BalanceInfo
          title={"Your Wallet"}
          displayAmount={totalWallet}
          changePercentage={percentageChange}
        />
        {/* Buttons */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 30,
            marginBottom: -15,
            paddingHorizontal: SIZES.radius,
          }}
        >
          <IconTextButton
            label={"Transfer"}
            icon={icons.send}
            containerStyle={{
              flex: 1,
              height: 40,
              marginRight: SIZES.radius,
            }}
            onPress={() => console.log("Transfer")}
          />
          <IconTextButton
            label={"Withdraw"}
            icon={icons.withdraw}
            containerStyle={{
              flex: 1,
              height: 40,
              marginRight: SIZES.radius,
            }}
            onPress={() => console.log("Widthdraw")}
          />
        </View>
      </View>
    );
  }

  const onRefresh = () => {
    dispatch(getAccountRequested({ address: connector.accounts[0] }));
  };

  return (
    <MainLayout>
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        <View style={{ paddingBottom: SIZES.radius }}>
          {/* Header - Wallet Info */}
          {renderWalletInfoSection()}
        </View>
        {/* Chart */}
        <Chart containerStyle={{ marginTop: SIZES.radius }} chartPrices={sparkline} />
        {/* Assets */}
        <FlatList
          data={holdings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ marginTop: SIZES.padding }}
          refreshControl={
            <RefreshControl
              refreshing={loadingGetAccount || loadingGetHoldings}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
            />
          }
          ListHeaderComponent={
            <View style={{ paddingHorizontal: SIZES.padding }}>
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
            const backgroundColor = item?.id === selectedCoin?.id ? COLORS.gray : COLORS.black;
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  height: 55,
                  paddingHorizontal: SIZES.padding,
                  backgroundColor,
                }}
                onPress={() => {
                  dispatch(getSparklineRequested({ id: item?.id, days: "7", interval: "hourly" }));
                  setSelectedCoin(item);
                }}
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
                    style={[FONTS.h4, { textAlign: "right", color: COLORS.white, lineHeight: 15 }]}
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
                    style={[FONTS.h4, { textAlign: "right", color: COLORS.white, lineHeight: 15 }]}
                  >{`$ ${item.total.toLocaleString()}`}</Text>
                  <Text
                    style={[
                      FONTS.body5,
                      { textAlign: "right", color: COLORS.lightGray3, lineHeight: 15 },
                    ]}
                  >{`${item.qty.toFixed(6)} ${item.symbol}`}</Text>
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

export default PortfolioScreen;
