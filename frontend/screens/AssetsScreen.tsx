import { MAINNET_API } from "@env";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import Web3 from "web3";

import { BalanceInfo, Chart, IconTextButton } from "../components";
import { FadeInView } from "../components/FadeInView";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { ReceiveModal, SendModal, WalletModal } from "../modals";
import { CreateWalletModal } from "../modals/CreateWalletModal";
import { LoadWalletModal } from "../modals/LoadWalletModal";
import { getAccountRequested } from "../store/account/slice";
import { getSparklineRequested, resetHoldings } from "../store/market/slice";
import { setToastMessages } from "../store/settings/slice";

import RootView from "./RootView";

const provider = new Web3.providers.HttpProvider(MAINNET_API);
export const web3: Web3 = new Web3(provider);

const AssetsScreen = () => {
  const walletModalRef = useRef<Modalize>(null);
  const sendModalRef = useRef<Modalize>(null);
  const receiveModalRef = useRef<Modalize>(null);
  const loadWalletModalRef = useRef<Modalize>(null);
  const createWalletModalRef = useRef<Modalize>(null);

  const { holdings, sparkline } = useAppSelector((state) => state.market);
  const { loadingGetAccount } = useAppSelector((state) => state.account);
  const { user } = useAppSelector((state) => state.account);
  const { toastMessages } = useAppSelector((state) => state.settings);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();

  const [selectedCoin, setSelectedCoin] = useState<any>(undefined);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    user?.wallets?.[0]?.address
  );

  const wallet = user?.wallets?.find((wallet) => wallet.address === selectedAddress);

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

  useFocusEffect(
    useCallback(() => {
      dispatch(getSparklineRequested({ id: holdings[0]?.id, days: "7", interval: "hourly" }));
    }, [])
  );

  useEffect(() => {
    dispatch(getAccountRequested({ address: selectedAddress }));
  }, []);

  useEffect(() => {
    if (connector.connected) {
      setSelectedAddress(connector.accounts[0]);
      dispatch(getAccountRequested({ address: connector.accounts[0] }));
      (async () =>
        await firestore()
          .collection("users")
          .doc(user.uid)
          .set(
            {
              wallets: {
                [connector.accounts[0]]: {
                  name: connector.bridge,
                  address: connector.accounts[0],
                  provider: "walletconnect",
                },
              },
            },
            { merge: true }
          ))();
    }
  }, [connector.connected]);

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

  const onRefresh = () => {
    dispatch(getAccountRequested({ address: selectedAddress }));
  };

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
            label={"Send"}
            customIcon={() => <Feather name="download" size={24} color="white" />}
            containerStyle={{
              flex: 1,
              height: 40,
              marginRight: SIZES.radius,
              borderColor: COLORS.lightGray,
              borderWidth: 1,
            }}
            onPress={() => sendModalRef.current?.open()}
          />
          <IconTextButton
            label={"Receive"}
            customIcon={() => <Feather name="upload" size={24} color="white" />}
            containerStyle={{
              flex: 1,
              height: 40,
              marginRight: SIZES.radius,
              borderColor: COLORS.lightGray,
              borderWidth: 1,
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
        <WalletModal
          ref={walletModalRef}
          create={() => {
            walletModalRef.current?.close();
            createWalletModalRef.current?.open();
          }}
          load={() => {
            walletModalRef.current?.close();
            loadWalletModalRef.current?.open();
          }}
          connect={connect}
        />
        <SendModal
          ref={sendModalRef}
          onPress={() => sendModalRef.current?.close()}
          web3={web3}
          address={selectedAddress}
        />
        <ReceiveModal
          ref={receiveModalRef}
          address={selectedAddress}
          onPress={() => {
            receiveModalRef.current?.close();
            dispatch(
              setToastMessages({ toastMessages: [...toastMessages, "Address copied to clipboard"] })
            );
          }}
        />
        <LoadWalletModal
          ref={loadWalletModalRef}
          user={user}
          web3={web3}
          onSelectWallet={(address) => {
            loadWalletModalRef.current?.close();
            setSelectedAddress(address);
            dispatch(getAccountRequested({ address }));
          }}
        />
        <CreateWalletModal
          ref={createWalletModalRef}
          onPress={() => createWalletModalRef.current?.close()}
          web3={web3}
        />
      </>
    </RootView>
  );
};

export default AssetsScreen;
