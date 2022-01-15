import { Feather, Ionicons } from "@expo/vector-icons";
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
import { AccountsModal, CreateAccountModal, ReceiveModal, SendModal, SwapModal } from "../modals";
import { AppStackParamList } from "../navigation";
import { getAccountRequested } from "../store/account";
import { resetHoldings } from "../store/market";
import { setToastMessages } from "../store/settings";
import {
  addAccountRequested,
  getAccountsRequested,
  removeAccountRequested,
} from "../store/wallet/slice";
import { Holding } from "../types";
import { CurrencyFormatter, getPriceColor } from "../util";

import RootView from "./RootView";

const AssetsScreen = () => {
  const accountsModalRef = useRef<Modalize>(null);
  const sendModalRef = useRef<Modalize>(null);
  const receiveModalRef = useRef<Modalize>(null);
  const createAccountModalRef = useRef<Modalize>(null);
  const swapModalRef = useRef<Modalize>(null);

  const { holdings } = useAppSelector((state) => state.market);
  const { loadingGetAccount } = useAppSelector((state) => state.account);
  const { toastMessages } = useAppSelector((state) => state.settings);
  const { accounts } = useAppSelector((state) => state.wallets);

  const navigation = useNavigation<StackNavigationProp<AppStackParamList, "NotificationScreen">>();
  const dispatch = useAppDispatch();
  const connector = useWalletConnect();
  const { colors } = useTheme();

  const [selectedHolding, setSelectedHolding] = useState<Holding>(undefined);
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    accounts?.[0]?.address
  );

  const account = accounts?.find((account) => account.address === selectedAddress);

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
          <TouchableOpacity onPress={() => accountsModalRef.current?.open()}>
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
    if (selectedAddress) {
      dispatch(getAccountRequested({ address: selectedAddress }));
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (connector.connected) {
      setSelectedAddress(connector.accounts[0]);
      dispatch(getAccountRequested({ address: connector.accounts[0] }));
      dispatch(
        addAccountRequested({
          account: {
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
              const wcWallet = accounts?.find((wallet) => wallet.provider === "walletconnect");
              dispatch(removeAccountRequested({ address: wcWallet.address }));
              setSelectedAddress(accounts?.[0]?.address);
              dispatch(getAccountRequested({ address: accounts?.[0]?.address }));
            },
          },
          { text: "Nevermind" },
        ]);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const onRefresh = () => {
    dispatch(getAccountRequested({ address: selectedAddress }));
    dispatch(getAccountsRequested());
  };

  return (
    <RootView>
      <>
        <View style={{ paddingVertical: SIZES.radius }}>
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
              title={account?.name || "Account #1"}
              displayAmount={totalWallet}
              changePercentage={percentageChange}
              colors={colors}
              address={selectedAddress}
            />
            {/* Buttons */}
            <View
              style={{
                flexDirection: "row",
                marginVertical: SIZES.radius,
                paddingHorizontal: SIZES.radius,
              }}
            >
              <IconTextButton
                label={"Send"}
                customIcon={() => <Feather name={"upload"} size={24} color={colors.text} />}
                onPress={() => sendModalRef.current?.open()}
                colors={colors}
                containerStyle={{ flex: 1 }}
              />
              <IconTextButton
                label={"Receive"}
                customIcon={() => <Feather name={"download"} size={24} color={colors.text} />}
                onPress={() => receiveModalRef.current?.open()}
                colors={colors}
                containerStyle={{ flex: 1 }}
              />
              <IconTextButton
                label={"Swap"}
                customIcon={() => (
                  <Ionicons name={"swap-horizontal"} size={24} color={colors.text} />
                )}
                onPress={() => swapModalRef.current?.open()}
                colors={colors}
                containerStyle={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
        {/* Assets */}
        <FlatList
          data={holdings}
          keyExtractor={(item, index) => item?.id || `${index}-flatlist`}
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
              <View style={{ flexDirection: "row" }}>
                <Text style={[FONTS.body5, { flex: 1, color: colors.textGray }]}>{"Asset"}</Text>
                <Text
                  style={[FONTS.body5, { flex: 1, color: colors.textGray, textAlign: "right" }]}
                >
                  {"Price"}
                </Text>
                <Text
                  style={[FONTS.body5, { flex: 1, color: colors.textGray, textAlign: "right" }]}
                >
                  {"Holdings"}
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const priceColor = getPriceColor(item?.priceChangePercentageInCurrency7d, colors);
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  height: 55,
                  paddingHorizontal: SIZES.padding,
                  backgroundColor: colors.background,
                }}
                onPress={() => setSelectedHolding(item)}
              >
                {/* Asset */}
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: item?.image }} style={{ width: 20, height: 20 }} />
                  <Text style={[FONTS.body4, { marginLeft: SIZES.radius, color: colors.text }]}>
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
        <AccountsModal
          ref={accountsModalRef}
          colors={colors}
          onCreate={() => {
            accountsModalRef.current?.close();
            createAccountModalRef.current?.open();
          }}
          onSelectWallet={(address) => {
            setSelectedAddress(address);
            dispatch(getAccountRequested({ address }));
            accountsModalRef.current?.close();
          }}
          onResetSelectedAddress={() => {
            setSelectedAddress(accounts?.[0]?.address);
          }}
          onWalletConnect={onWalletConnect}
          onClose={() => accountsModalRef.current?.close()}
          address={selectedAddress}
          connector={connector}
        />
        <SendModal
          ref={sendModalRef}
          colors={colors}
          onPress={() => sendModalRef.current?.close()}
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
        <CreateAccountModal
          ref={createAccountModalRef}
          colors={colors}
          onPress={(address) => {
            setSelectedAddress(address);
            createAccountModalRef.current?.close();
          }}
        />
        <SwapModal
          ref={swapModalRef}
          colors={colors}
          address={selectedAddress}
          onPress={() => swapModalRef.current?.close()}
        />
      </>
    </RootView>
  );
};

export default AssetsScreen;
