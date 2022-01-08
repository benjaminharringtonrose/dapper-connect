import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Alert, Animated, Easing, Image, View } from "react-native";
import RNExitApp from "react-native-exit-app";
import { Modalize } from "react-native-modalize";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "../components/Button";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { saveOnboardStatus } from "../helpers";
import { useAppDispatch, useAppSelector } from "../hooks";
import { OnboardCreateWalletModal } from "../modals/OnboardCreateWalletModal";
import { OnboardSeedPhraseModal } from "../modals/OnboardSeedPhraseModal";
import { setAuthenticated } from "../store/settings/slice";
import { onboardCreateWalletRequested, setOnboardStatus } from "../store/wallet/slice";

import RootView from "./RootView";

const StartupScreen = () => {
  const { loadingFrontloadApp, faceID } = useAppSelector((state) => state.settings);
  const { onboarded, loadingOnboardCreateWallet, wallets } = useAppSelector(
    (state) => state.wallets
  );

  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const anim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const createWalletModalRef = useRef<Modalize>(null);
  const seedPhraseModalRef = useRef<Modalize>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    (async () => {
      if (onboarded) {
        if (!faceID) {
          dispatch(setAuthenticated({ authenticated: true }));
        } else {
          await biometricsAuth();
        }
      }
    })();
  }, [faceID, onboarded]);

  useEffect(() => {
    if (!loadingOnboardCreateWallet && !!wallets[0] && !onboarded) {
      console.log("triggered");
      seedPhraseModalRef.current?.open();
    }
  }, [loadingOnboardCreateWallet, wallets]);

  const biometricsAuth = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert("This device is not compatible for biometric authentication");
      }
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert("This device doesn't have biometric authentication enabled");
      }
      const result = await LocalAuthentication.authenticateAsync();

      if (!result.success) {
        Alert.alert(
          "Lock Out",
          "You're locked out of DapperWallet because you cancelled the authentication process. Start over?",
          [
            { text: "Start Over", onPress: async () => await biometricsAuth(), style: "default" },
            {
              text: "Close App",
              onPress: async () => {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setTimeout(() => {
                  RNExitApp.exitApp();
                }, 400);
              },
              style: "destructive",
            },
          ]
        );
      } else {
        dispatch(setAuthenticated({ authenticated: true }));
      }
    } catch (error) {
      console.warn("error", error);
      dispatch(setAuthenticated({ authenticated: false }));
    }
    return;
  };

  const onCreateNewWallet = () => {
    dispatch(onboardCreateWalletRequested());
    createWalletModalRef.current?.close();
  };

  const onUseExistingWallet = () => {
    //
  };

  return (
    <RootView>
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.black,
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-SIZES.height / 2 + 60, -60],
                  }),
                },
              ],
            }}
          >
            <Image
              source={icons.wallet}
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
              }}
            />
          </Animated.View>

          <Animated.Text
            style={[
              FONTS.h1,
              {
                opacity,
                color: COLORS.white,
                position: "absolute",
                transform: [
                  {
                    translateY: opacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [60, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {"DapperWallet"}
          </Animated.Text>
          {loadingFrontloadApp && (
            <Animated.View style={{ opacity }}>
              <ActivityIndicator size={"large"} color={colors.activityIndicator} />
            </Animated.View>
          )}
        </View>
        <Animated.View style={{ opacity }}>
          {!onboarded && (
            <Button
              label={"Create a wallet"}
              colors={colors}
              onPress={() => createWalletModalRef.current?.open()}
              loading={loadingOnboardCreateWallet}
              style={{
                position: "absolute",
                bottom: insets.bottom + 100,
                left: 0,
                right: 0,
                marginHorizontal: SIZES.padding,
              }}
            />
          )}
        </Animated.View>
        <Animated.View style={{ opacity }}>
          {!onboarded && (
            <Button
              label={"Import wallet"}
              colors={colors}
              onPress={onUseExistingWallet}
              style={{
                position: "absolute",
                bottom: insets.bottom + 50,
                left: 0,
                right: 0,
                marginHorizontal: SIZES.padding,
              }}
            />
          )}
        </Animated.View>
        <OnboardCreateWalletModal
          ref={createWalletModalRef}
          onCreateNewWallet={onCreateNewWallet}
          colors={colors}
        />
        <OnboardSeedPhraseModal
          ref={seedPhraseModalRef}
          onCreateCompleteOnboarding={async () => {
            console.log("here");
            await saveOnboardStatus(true);
            dispatch(setOnboardStatus({ onboarded: true }));
            seedPhraseModalRef.current?.close();
          }}
          colors={colors}
        />
      </>
    </RootView>
  );
};

export default StartupScreen;
