import { Entypo } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

import { Button, FormInput } from "../components";
import { FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { usePassword } from "../hooks/usePassword";
import { useSeedPhrase } from "../hooks/useSeedPhrase";
import { setToastMessages } from "../store/settings";

import RootView from "./RootView";

const ViewSeedPhraseScreen = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const password = usePassword();
  const seedPhrase = useSeedPhrase();
  const { toastMessages } = useAppSelector((state) => state.settings);

  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false);
  const [passwordText, setPasswordText] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  useEffect(() => {
    if (showSeedPhrase) {
      onCopySeedPhrase();
    }
  }, [showSeedPhrase]);

  const onSubmit = async () => {
    if (!passwordText) {
      return setPasswordError("required");
    } else if (passwordText !== password) {
      return setPasswordError("incorrect password");
    } else {
      setShowSeedPhrase(true);
      return setPasswordError("");
    }
  };

  const onCopySeedPhrase = () => {
    Clipboard.setString(seedPhrase);
    dispatch(
      setToastMessages({ toastMessages: [...toastMessages, "Address copied to clipboard"] })
    );
  };
  return (
    <RootView>
      <>
        <View style={{ margin: SIZES.padding }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={[FONTS.h2, { paddingBottom: SIZES.radius, color: colors.text }]}>
              {"View Seed Phrase"}
            </Text>
            <Entypo name={"lock"} size={24} color={colors.text} />
          </View>

          <Text style={[FONTS.body4, { paddingBottom: SIZES.radius, color: colors.text }]}>
            {"Enter your password to see your seed phrase."}
          </Text>
          <View
            style={{
              backgroundColor: colors.input,
              borderRadius: SIZES.radius,
              borderWidth: 1,
              borderColor: colors.border,
              padding: SIZES.radius,
              marginVertical: SIZES.radius,
            }}
          >
            <FormInput
              label={"password"}
              onChangeText={(text) => setPasswordText(text)}
              autoCorrect={true}
              value={passwordText}
              error={passwordError}
              touched={true}
              inputStyle={{ flex: 1 }}
              colors={colors}
              secureTextEntry={true}
              noBorder
            />
          </View>
          <Button
            label={"View"}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onSubmit();
            }}
            style={{ marginVertical: SIZES.radius }}
            colors={colors}
          />
          {showSeedPhrase && <Text style={{ color: colors.text }}>{seedPhrase}</Text>}
        </View>
      </>
    </RootView>
  );
};

export default ViewSeedPhraseScreen;
