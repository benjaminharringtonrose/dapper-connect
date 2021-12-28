import { MAINNET_API, RINKEBY_API } from "@env";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import Web3 from "web3";

import { BalanceInfo, Chart, IconTextButton } from "../components";
import { FadeInView } from "../components/FadeInView";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { ReceiveModal, SendModal, WalletModal } from "../modals";
import { getAccountRequested } from "../store/account/slice";
import { getSparklineRequested, resetHoldings } from "../store/market/slice";

import RootView from "./RootView";

const provider = new Web3.providers.HttpProvider(MAINNET_API);
export const web3: Web3 = new Web3(provider);

const AssetsScreen = () => {
  const walletModalRef = useRef<Modalize>(null);
  const sendModalRef = useRef<Modalize>(null);
  const receiveModalRef = useRef<Modalize>(null);

  const { holdings, sparkline } = useAppSelector((state) => state.market);
  const { account, loadingGetAccount } = useAppSelector((state) => state.account);
  const { user } = useAppSelector((state) => state.account);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();

  const [selectedCoin, setSelectedCoin] = useState<any>(undefined);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FadeInView>
          <TouchableOpacity onPress={() => walletModalRef.current?.open()}>
            <Ionicons name={"wallet"} size={32} color={COLORS.white} />
          </TouchableOpacity>
        </FadeInView>
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
    walletModalRef.current?.close();
  }

  useFocusEffect(
    useCallback(() => {
      dispatch(getSparklineRequested({ id: holdings[0]?.id, days: "7", interval: "hourly" }));
    }, [])
  );

  useEffect(() => {
    if (connector.connected) {
      dispatch(getAccountRequested({ address: connector.accounts[0] }));
      (async () =>
        await firestore().collection("users").doc(user.uid).set(
          {
            walletAddress: connector.accounts[0],
            walletProvider: "walletconnect",
          },
          { merge: true }
        ))();
    }
  }, [connector.connected]);

  const totalWallet = holdings?.reduce((a, b) => a + (b.total || 0), 0);
  const valueChange = holdings?.reduce((a, b) => a + (b.holdingValueChange7d || 0), 0);
  const percentageChange = valueChange
    ? (valueChange / (totalWallet - valueChange)) * 100
    : undefined;

  const onRefresh = () => {
    dispatch(getAccountRequested({ address: connector.accounts[0] }));
  };

  const createNewWallet = async () => {
    try {
      walletModalRef.current?.close();
      if (connector.connected) {
        await connector.killSession();
      }
      const account = await web3.eth.accounts.create(web3.utils.randomHex(32));
      const wallet = await web3.eth.accounts.wallet.add(account);
      console.log("account: ", account);
      console.log("wallet: ", wallet);
      // const password = await web3.utils.randomHex(32);
      // const keystore = await wallet.encrypt(password);
      // console.log("keystore: ", keystore);
      await firestore().collection("users").doc(user.uid).set(
        {
          walletAddress: wallet.address,
          walletPrivateKey: wallet.privateKey,
          walletProvider: "local",
        },
        { merge: true }
      );
      dispatch(getAccountRequested({ address: wallet.address }));
    } catch (error) {
      console.warn(error);
    }
  };

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
            label={"Send"}
            icon={icons.send}
            containerStyle={{
              flex: 1,
              height: 40,
              marginRight: SIZES.radius,
            }}
            onPress={() => sendModalRef.current?.open()}
          />
          <IconTextButton
            label={"Receive"}
            icon={icons.withdraw}
            containerStyle={{
              flex: 1,
              height: 40,
              marginRight: SIZES.radius,
            }}
            onPress={() => receiveModalRef.current?.open()}
          />
        </View>
      </View>
    );
  }

  return (
    <RootView>
      <>
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
            keyExtractor={(item, index) => item?.id || `${index}-flatlist`}
            contentContainerStyle={{ marginTop: SIZES.padding }}
            refreshControl={
              <RefreshControl
                refreshing={loadingGetAccount}
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
                item?.priceChangePercentageInCurrency7d === 0
                  ? COLORS.lightGray3
                  : item?.priceChangePercentageInCurrency7d > 0
                  ? COLORS.lightGreen
                  : COLORS.red;
              const backgroundColor = selectedCoin?.id
                ? item?.id === selectedCoin?.id
                  ? COLORS.gray
                  : COLORS.black
                : item?.id === holdings?.[0]?.id
                ? COLORS.gray
                : COLORS.black;
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    height: 55,
                    paddingHorizontal: SIZES.padding,
                    backgroundColor,
                  }}
                  onPress={() => {
                    dispatch(
                      getSparklineRequested({ id: item?.id, days: "7", interval: "hourly" })
                    );
                    setSelectedCoin(item);
                  }}
                >
                  {/* Asset */}
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: item?.image }} style={{ width: 20, height: 20 }} />
                    <Text style={[FONTS.h4, { marginLeft: SIZES.radius, color: COLORS.white }]}>
                      {item?.name}
                    </Text>
                  </View>
                  {/* Price */}
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={[
                        FONTS.h4,
                        { textAlign: "right", color: COLORS.white, lineHeight: 15 },
                      ]}
                    >{`$${item?.currentPrice?.toLocaleString()}`}</Text>
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
                      >{`${item?.priceChangePercentageInCurrency7d?.toFixed(2)} %`}</Text>
                    </View>
                  </View>
                  {/* Holdings */}
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={[
                        FONTS.h4,
                        { textAlign: "right", color: COLORS.white, lineHeight: 15 },
                      ]}
                    >{`$ ${item?.total?.toLocaleString()}`}</Text>
                    <Text
                      style={[
                        FONTS.body5,
                        { textAlign: "right", color: COLORS.lightGray3, lineHeight: 15 },
                      ]}
                    >{`${item?.qty?.toFixed(6)} ${item?.symbol}`}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={<View style={{ marginBottom: 50 }} />}
          />
        </View>
        <WalletModal ref={walletModalRef} create={createNewWallet} connect={connect} />
        <SendModal ref={sendModalRef} onPress={() => sendModalRef.current?.close()} />
        <ReceiveModal ref={receiveModalRef} onPress={() => receiveModalRef.current?.close()} />
      </>
    </RootView>
  );
};

export default AssetsScreen;
