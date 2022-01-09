import { Entypo } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import * as Haptics from "expo-haptics";
import React, { forwardRef, Ref, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "../components";
import { FONTS, SIZES } from "../constants";
import { useSeedphrase } from "../hooks/useSeedphrase";

interface OnboardSeedPhraseModalProps {
  onCreateCompleteOnboarding: () => void;
  colors: ReactNativePaper.ThemeColors;
}

export const OnboardSeedPhraseModal = forwardRef(
  (props: OnboardSeedPhraseModalProps, ref: Ref<Modalize>) => {
    const insets = useSafeAreaInsets();

    const [seedPhraseArray, setSeedPhraseArray] = useState<string[]>([]);
    const [secretPhrasCopied, setSecretPhraseCopied] = useState<boolean>(false);

    const seedphrase = useSeedphrase();

    useEffect(() => {
      let phraseWords: string[];
      if (seedphrase) {
        phraseWords = String(seedphrase).split(" ");
      }
      setSeedPhraseArray(phraseWords);
    }, [seedphrase]);

    return (
      <Portal>
        <Modalize
          ref={ref}
          useNativeDriver={false}
          adjustToContentHeight={true}
          disableScrollIfPossible={false}
          modalStyle={{ backgroundColor: props.colors.modal }}
          handleStyle={{ backgroundColor: props.colors.modalHandle }}
        >
          <View style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[FONTS.h2, { paddingBottom: SIZES.radius, color: props.colors.text }]}>
                {"2. Save your Secret Phrase"}
              </Text>
              <Entypo name={"lock"} size={24} color={props.colors.text} />
            </View>
            <Text style={[FONTS.body4, { color: props.colors.text }]}>
              {
                "This is your 12-word secret phrase. Write it down in multiple secure locations. We cannot help you recover your wallet if you lose both your password and your secret phrase!"
              }
            </Text>
          </View>
          <View
            style={{
              marginTop: SIZES.padding,
              marginHorizontal: SIZES.padding,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {seedPhraseArray?.map((phrase, index) => {
              return (
                <View
                  key={`${index}-${phrase}`}
                  style={{
                    minWidth: SIZES.width / 4,
                    borderColor: props.colors.border,
                    borderWidth: 1,
                    borderRadius: SIZES.radius,
                    padding: SIZES.radius,
                    marginBottom: SIZES.radius,
                  }}
                >
                  <Text
                    style={[FONTS.body5, { color: props.colors.text, textAlign: "center" }]}
                  >{`${index + 1}. ${phrase}`}</Text>
                </View>
              );
            })}
          </View>
          <Button
            label={!secretPhrasCopied ? "Copy" : "Copied"}
            postfixIcon={!secretPhrasCopied ? "copy" : "check"}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Clipboard.setString(seedPhraseArray.join(" "));
              setSecretPhraseCopied(true);
            }}
            style={{ marginHorizontal: SIZES.padding, marginBottom: SIZES.radius }}
            colors={props.colors}
          />
          <Button
            label={"Finish"}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              props?.onCreateCompleteOnboarding();
            }}
            style={{ marginHorizontal: SIZES.padding, marginBottom: SIZES.radius }}
            colors={props.colors}
          />
          <View style={{ backgroundColor: props.colors.modal, paddingBottom: insets.bottom }} />
        </Modalize>
      </Portal>
    );
  }
);
