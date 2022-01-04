import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { useTheme } from "react-native-paper";

import { BalanceInfo, FadeInView, IconTextButton } from "../components";
import { FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { CreateWalletModal, ReceiveModal, SendModal, WalletModal } from "../modals";
import { AppStackParamList } from "../navigation";
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

  const navigation = useNavigation<StackNavigationProp<AppStackParamList, "NotificationScreen">>();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();
  const { colors } = useTheme();

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
            paddingRight: SIZES.radius,
          }}
        >
          <TouchableOpacity onPress={() => walletModalRef.current?.open()}>
            <Ionicons name={"wallet"} size={32} color={colors.primary} />
          </TouchableOpacity>
        </FadeInView>
      ),
      headerLeft: () => (
        <FadeInView
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: SIZES.radius,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
            <MaterialCommunityIcons name={"bell"} size={30} color={colors.primary} />
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
    <RootView>
      <>
        <View style={{ paddingBottom: SIZES.padding }}>
          {/* Header - Wallet Info */}
          <View
            style={{
              paddingTop: SIZES.padding,
              paddingHorizontal: SIZES.padding,
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: SIZES.radius,
              marginHorizontal: SIZES.radius,
            }}
          >
            {/* Balance Info */}
            <BalanceInfo
              title={wallet?.name || "Your Wallet"}
              displayAmount={totalWallet}
              changePercentage={percentageChange}
              colors={colors}
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
                customIcon={() => <Feather name={"upload"} size={24} color={colors.background} />}
                containerStyle={{
                  flex: 1,
                  height: 40,
                  marginRight: SIZES.radius,
                }}
                onPress={() => sendModalRef.current?.open()}
                colors={colors}
              />
              <IconTextButton
                label={"Receive"}
                customIcon={() => <Feather name={"download"} size={24} color={colors.background} />}
                containerStyle={{
                  flex: 1,
                  height: 40,
                  marginRight: SIZES.radius,
                }}
                onPress={() => receiveModalRef.current?.open()}
                colors={colors}
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
              tintColor={colors.activityIndicator}
            />
          }
          ListHeaderComponent={
            <View style={{ paddingHorizontal: SIZES.padding }}>
              {/* Header Label */}
              <View style={{ flexDirection: "row", marginTop: SIZES.radius }}>
                <Text style={[FONTS.h5, { flex: 1, color: colors.textGray }]}>{"Asset"}</Text>
                <Text style={[FONTS.h5, { flex: 1, color: colors.textGray, textAlign: "right" }]}>
                  {"Price"}
                </Text>
                <Text style={[FONTS.h5, { flex: 1, color: colors.textGray, textAlign: "right" }]}>
                  {"Holdings"}
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const priceColor =
              item?.priceChangePercentageInCurrency7d === 0
                ? colors.textGray
                : item?.priceChangePercentageInCurrency7d > 0
                ? colors.success
                : colors.error;

            const backgroundColor = selectedHolding?.id
              ? item?.id === selectedHolding?.id
                ? colors.accent
                : colors.background
              : item?.id === holdings?.[0]?.id
              ? colors.accent
              : colors.background;

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
                  <Text style={[FONTS.h4, { marginLeft: SIZES.radius, color: colors.text }]}>
                    {item?.name}
                  </Text>
                </View>
                {/* Price */}
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={[FONTS.h4, { textAlign: "right", color: colors.text, lineHeight: 15 }]}
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
                    style={[FONTS.h4, { textAlign: "right", color: colors.text, lineHeight: 15 }]}
                  >{`${CurrencyFormatter.format(item?.total)}`}</Text>
                  <Text
                    style={[
                      FONTS.body5,
                      { textAlign: "right", color: colors.textGray, lineHeight: 15 },
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
          colors={colors}
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
          colors={colors}
          onPress={() => sendModalRef.current?.close()}
          web3={web3}
          address={selectedAddress}
        />
        <ReceiveModal
          ref={receiveModalRef}
          colors={colors}
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
          colors={colors}
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
