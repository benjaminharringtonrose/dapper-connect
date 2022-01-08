import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import RNExitApp from "react-native-exit-app";
import { Modalize } from "react-native-modalize";
import { useTheme } from "react-native-paper";

import { Button, SectionTitle } from "../components";
import { FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NetworkModal } from "../modals/NetworkModal";
import { hardResetAppRequested, setColorScheme, toggleFaceId } from "../store/settings/slice";
import { Network } from "../types";

import RootView from "./RootView";

const SettingsScreen = () => {
  const networkModalRef = useRef<Modalize>(null);
  const { network, colorScheme, faceID } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const getNetworkName = (network: Network) => {
    switch (network) {
      case "mainnet":
        return "Mainnet";
      case "kovan":
        return "Kovan (test network)";
      default:
        return "--";
    }
  };

  return (
    <RootView>
      <View style={{ flex: 1 }}>
        {/* Details */}
        <ScrollView style={{ paddingHorizontal: SIZES.padding }}>
          {/* APP */}
          <SectionTitle title={"APP"} containerStyle={{ marginTop: SIZES.padding }} />
          <Setting
            title={"Dark Mode"}
            value={colorScheme === "dark"}
            type={"switch"}
            onPress={() =>
              dispatch(setColorScheme({ colorScheme: colorScheme === "dark" ? "light" : "dark" }))
            }
            colors={colors}
          />
          <Setting
            title={"Network"}
            value={getNetworkName(network)}
            type={"button"}
            onPress={() => networkModalRef.current?.open()}
            iconType={"down"}
            colors={colors}
          />
          {/* SECURITY */}
          <SectionTitle title={"SECURITY"} containerStyle={{ marginTop: SIZES.padding }} />
          <Setting
            title={"FaceID"}
            value={faceID}
            type={"switch"}
            onPress={() => dispatch(toggleFaceId({ faceID: !faceID }))}
            colors={colors}
          />
          <Setting
            title={"Change Password"}
            value={""}
            type={"button"}
            onPress={() => "press"}
            iconType={"right"}
            colors={colors}
          />
          <Setting
            title={"Multi-Factor Authentication"}
            value={""}
            type={"button"}
            onPress={() => "press"}
            iconType={"right"}
            colors={colors}
          />
          <Button
            type={"bordered"}
            label={"Hard reset app"}
            style={{ marginVertical: SIZES.padding }}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              dispatch(hardResetAppRequested());
            }}
            colors={colors}
          />
          <Button
            type={"bordered"}
            label={"Close App"}
            style={{ marginVertical: SIZES.padding }}
            onPress={async () => {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              setTimeout(() => {
                RNExitApp.exitApp();
              }, 400);
            }}
            colors={colors}
          />
        </ScrollView>
        <NetworkModal
          ref={networkModalRef}
          network={network}
          onClose={() => networkModalRef.current?.close()}
          colors={colors}
        />
      </View>
    </RootView>
  );
};

export default SettingsScreen;

const Setting = ({
  title,
  value,
  type,
  iconType,
  onPress,
  colors,
}: {
  title: string;
  value?: string | boolean;
  type: "button" | "switch";
  iconType?: "down" | "right";
  onPress: (value?: boolean) => void;
  colors: ReactNativePaper.ThemeColors;
}) => {
  const iconName = iconType === "down" ? "chevron-down" : "chevron-right";
  if (type === "button") {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", height: 50, alignItems: "center" }}
        onPress={() => onPress()}
      >
        <Text style={[FONTS.h3, { flex: 1, color: colors.text }]}>{title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[FONTS.h3, { marginRight: SIZES.radius, color: colors.text }]}>{value}</Text>
          <Feather name={iconName} size={24} color={colors.text} />
        </View>
      </TouchableOpacity>
    );
  } else if (type === "switch" && typeof value == "boolean") {
    return (
      <View style={{ flexDirection: "row", height: 50, alignItems: "center" }}>
        <Text style={[FONTS.h3, { flex: 1, color: colors.text }]}>{title}</Text>
        <Switch
          value={value}
          onValueChange={(value) => onPress(value)}
          trackColor={{ true: colors.primary, false: colors.bottomTabInactive }}
        />
      </View>
    );
  } else {
    return null;
  }
};
