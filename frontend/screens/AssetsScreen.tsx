import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";

import { BalanceInfo, FadeInView, IconTextButton } from "../components";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { CreateWalletModal, ReceiveModal, SendModal, WalletModal } from "../modals";
import { getAccountRequested } from "../store/account";
import { resetHoldings } from "../store/market";
import { setToastMessages } from "../store/settings";
import { addWalletRequested, getWalletsRequested, removeWalletRequested } from "../store/wallet";
import { web3 } from "../store/web3";
import { Holding } from "../types";
import { CurrencyFormatter } from "../util";

import RootView from "./RootView";

const AssetsScreen = () => {
  const walletModalRef = useRef<Modalize>(null);
  const sendModalRef = useRef<Modalize>(null);
  const receiveModalRef = useRef<Modalize>(null);
  const createWalletModalRef = useRef<Modalize>(null);

  const { holdings } = useAppSelector((state) => state.market);
  const { loadingGetAccount } = useAppSelector((state) => state.account);
  const { toastMessages } = useAppSelector((state) => state.settings);
  const { wallets } = useAppSelector((state) => state.wallets);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();

  const [selectedHolding, setSelectedHolding] = useState<Holding>(undefined);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(wallets?.[0]?.address);

  const wallet = wallets?.find((wallet) => wallet.address === selectedAddress);

  const totalWallet = holdings?.reduce((a, b) => a + (b.total || 0), 0);
  const valueChange = holdings?.reduce((a, b) => a + (b.holdingValueChange7d || 0), 0);
  const percentageChange = valueChange
    ? (valueChange / (totalWallet - valueChange)) * 100
    : undefined;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <FadeInView
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => walletModalRef.current?.open()}>
            <Ionicons name={"wallet"} size={32} color={COLORS.white} />
          </TouchableOpacity>
        </FadeInView>
      ),
    });
  });

  useEffect(() => {
    dispatch(getAccountRequested({ address: selectedAddress }));
  }, []);

  useEffect(() => {
    if (connector.connected) {
      setSelectedAddress(connector.accounts[0]);
      dispatch(getAccountRequested({ address: connector.accounts[0] }));
      dispatch(
        addWalletRequested({
          wallet: {
            name: connector.clientMeta.name,
            address: connector.accounts[0],
            provider: "walletconnect",
          },
        })
      );
    }
  }, [connector.connected]);

  const onWalletConnect = async () => {
    try {
      if (!connector.connected) {
        await connector.connect();
      } else {
        Alert.alert("Your wallet is already connected!", "", [
          {
            text: "Disconnect",
            onPress: async () => {
              connector.killSession();
              dispatch(resetHoldings());
              const wcWallet = wallets?.find((wallet) => wallet.provider === "walletconnect");
              dispatch(removeWalletRequested({ address: wcWallet.address }));
              setSelectedAddress(wallets?.[0]?.address);
              dispatch(getAccountRequested({ address: wallets?.[0]?.address }));
            },
          },
          { text: "Nevermind" },
        ]);
      }
    } catch (e) {
      console.log(e.message);
    }
    walletModalRef.current?.close();
  };

  const onRefresh = () => {
    dispatch(getAccountRequested({ address: selectedAddress }));
    dispatch(getWalletsRequested());
  };

  return (
    <RootView style={{ backgroundColor: COLORS.black }}>
      <>
        <View style={{ paddingBottom: SIZES.padding }}>
          {/* Header - Wallet Info */}
          <View
            style={{
              paddingTop: SIZES.padding,
              paddingHorizontal: SIZES.padding,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: COLORS.lightGray,
              backgroundColor: COLORS.black,
            }}
          >
            {/* Balance Info */}
            <BalanceInfo
              title={wallet?.name || "Your Wallet"}
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
                customIcon={() => <Feather name={"upload"} size={24} color={COLORS.white} />}
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
                customIcon={() => <Feather name={"download"} size={24} color={COLORS.white} />}
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
        </View>
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

            const backgroundColor = selectedHolding?.id
              ? item?.id === selectedHolding?.id
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
                onPress={() => setSelectedHolding(item)}
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
                    style={[FONTS.h4, { textAlign: "right", color: COLORS.white, lineHeight: 15 }]}
                  >{`${CurrencyFormatter.format(item?.currentPrice)}`}</Text>
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
                    style={[FONTS.h4, { textAlign: "right", color: COLORS.white, lineHeight: 15 }]}
                  >{`${CurrencyFormatter.format(item?.total)}`}</Text>
                  <Text
                    style={[
                      FONTS.body5,
                      { textAlign: "right", color: COLORS.lightGray3, lineHeight: 15 },
                    ]}
                  >{`${item?.qty?.toFixed(4)} ${item?.symbol}`}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }} />}
        />
        <WalletModal
          ref={walletModalRef}
          onCreate={() => {
            walletModalRef.current?.close();
            createWalletModalRef.current?.open();
          }}
          onSelectWallet={(address) => {
            walletModalRef.current?.close();
            setSelectedAddress(address);
            dispatch(getAccountRequested({ address }));
          }}
          onResetSelectedAddress={() => {
            setSelectedAddress(wallets?.[0]?.address);
          }}
          onWalletConnect={onWalletConnect}
          onClose={() => walletModalRef.current?.close()}
          address={selectedAddress}
          connector={connector}
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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Clipboard.setString(selectedAddress);
            receiveModalRef.current?.close();
            dispatch(
              setToastMessages({ toastMessages: [...toastMessages, "Address copied to clipboard"] })
            );
          }}
        />
        <CreateWalletModal
          ref={createWalletModalRef}
          onPress={(address) => {
            setSelectedAddress(address);
            createWalletModalRef.current?.close();
          }}
          web3={web3}
        />
      </>
    </RootView>
  );
};

export default AssetsScreen;
