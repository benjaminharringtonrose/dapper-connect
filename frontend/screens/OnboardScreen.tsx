import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

import { Button } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";

import RootView from "./RootView";

const OnboardScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <RootView>
      <>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={[FONTS.h1, { color: colors.text }]}>{"DapperWallet"}</Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button label={"Create a new wallet"} colors={colors} />
          <Button label={"I already have a wallet"} colors={colors} />
        </View>
      </>
    </RootView>
  );
};

export default OnboardScreen;
