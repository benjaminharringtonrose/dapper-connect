import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Web3 from "web3";

import { BalanceInfo, Chart, IconTextButton } from "../components";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { mockHoldings } from "../constants/mock";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getCoinMarketRequested, getHoldingsRequested, resetHoldings } from "../store/market/slice";
import { Coin } from "../types";

import MainLayout from "./MainLayout";

const HomeScreen = () => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | undefined>(undefined);
  const [ether, setEther] = useState("");
  const {
    holdings,
    loadingGetHoldings,
    // errorGetHoldings,
    coins,
    loadingGetCoinMarket,
    // errorGetCoinMarket,
  } = useAppSelector((state) => state.market);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();

  const provider = new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/7b9909b1c3ed4958a172e2ad2e6c66a3"
  );
  const web3: Web3 = new Web3(provider);

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

  useFocusEffect(
    useCallback(() => {
      dispatch(getCoinMarketRequested({}));
    }, [])
  );

  async function connect() {
    try {
      if (!connector.connected) {
        await connector.connect();
      } else {
        Alert.alert("You're wallet is already connected!", "", [
          { text: "Nevermind" },
          {
            text: "Disconnect",
            onPress: () => {
              connector.killSession();
              dispatch(resetHoldings());
            },
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (connector.connected) {
      (async () => {
        const weiBalance = await web3.eth.getBalance(connector.accounts[0]);
        const ether = Number(web3.utils.fromWei(weiBalance, "ether")).toFixed(8);
        dispatch(
          getHoldingsRequested({
            holdings: [{ id: "ethereum", qty: ether }],
          })
        );
        setEther(ether);
      })();
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
    dispatch(getCoinMarketRequested({}));
    dispatch(
      getHoldingsRequested({
        holdings: [{ id: "ethereum", qty: ether }],
      })
    );
  };

  return (
    <MainLayout>
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        {/* Top Cryptocurrency */}
        <FlatList
          data={coins}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ marginTop: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={loadingGetHoldings || loadingGetCoinMarket}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
            />
          }
          ListHeaderComponent={
            <>
              <View style={{ flex: 1, paddingBottom: SIZES.radius }}>
                {/* Header - Wallet Info */}
                {renderWalletInfoSection()}
                {/* Chart */}
                <Chart
                  containerStyle={{ marginTop: SIZES.padding * 2 }}
                  chartPrices={
                    selectedCoin
                      ? selectedCoin?.sparkline_in_7d?.price
                      : coins[0]?.sparkline_in_7d.price
                  }
                />
              </View>
              <View style={{ marginBottom: SIZES.radius }}>
                <Text style={[FONTS.h3, { fontSize: 18, color: COLORS.white }]}>
                  {"Top Cryptocurrency"}
                </Text>
              </View>
            </>
          }
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
