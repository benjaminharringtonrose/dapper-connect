import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useEffect, useRef } from "react";
import { Alert, Animated, Easing, Image, View } from "react-native";
import RNExitApp from "react-native-exit-app";
import { Modalize } from "react-native-modalize";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { secureStore } from "../classes";
import Button from "../components/Button";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { OnboardCreateWalletModal } from "../modals/OnboardCreateWalletModal";
import { OnboardExistingWalletModal } from "../modals/OnboardExistingWalletModal";
import { OnboardSeedPhraseModal } from "../modals/OnboardSeedPhraseModal";
import { setAuthenticated } from "../store/settings/slice";
import { onboardWalletRequested, setOnboardStatus } from "../store/wallet/slice";

import RootView from "./RootView";

const StartupScreen = () => {
  const { faceID } = useAppSelector((state) => state.settings);
  const { onboarded, loadingOnboardWallet, wallets } = useAppSelector((state) => state.wallets);

  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const anim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const createWalletModalRef = useRef<Modalize>(null);
  const seedPhraseModalRef = useRef<Modalize>(null);
  const existingWalletModalRef = useRef<Modalize>(null);

  useEffect(() => {
    Animated.parallel([
      // shift into place
      Animated.timing(anim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
      // opacity
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),

      Animated.loop(
        Animated.sequence([
          Animated.delay(100),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
      // scaler
      Animated.loop(
        Animated.sequence([
          Animated.delay(100),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
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
    if (!loadingOnboardWallet && !!wallets[0] && !onboarded) {
      seedPhraseModalRef.current?.open();
    }
  }, [loadingOnboardWallet, wallets]);

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

  // new wallet flow
  const onCreateNewWallet = () => {
    dispatch(onboardWalletRequested({}));
    createWalletModalRef.current?.close();
  };
  const onCompleteNewOnboarding = async () => {
    await secureStore.setOnboardStatus(true);
    dispatch(setOnboardStatus({ onboarded: true }));
    seedPhraseModalRef.current?.close();
  };

  // existing wallet flow
  const onUseExistingWallet = async (seedphrase) => {
    dispatch(onboardWalletRequested({ seedphrase }));
    await secureStore.setOnboardStatus(true);
    dispatch(setOnboardStatus({ onboarded: true }));
    existingWalletModalRef.current?.close();
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
              opacity,
              transform: [
                {
                  translateY: floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-89, -80],
                  }),
                },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["-2deg", "2deg"],
                  }),
                },
                {
                  scale: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.07],
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
        </View>
        <Animated.View style={{ opacity }}>
          {!onboarded && (
            <Button
              label={"Create a wallet"}
              colors={colors}
              onPress={() => createWalletModalRef.current?.open()}
              loading={loadingOnboardWallet}
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
              onPress={() => existingWalletModalRef.current?.open()}
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
          onCreateCompleteOnboarding={onCompleteNewOnboarding}
          colors={colors}
        />
        <OnboardExistingWalletModal
          ref={existingWalletModalRef}
          onUseExistingWallet={onUseExistingWallet}
          colors={colors}
        />
      </>
    </RootView>
  );
};

export default StartupScreen;
