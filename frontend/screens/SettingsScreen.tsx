import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { Modalize } from "react-native-modalize";

import { Button, SectionTitle } from "../components";
import { COLORS, FONTS, SIZES } from "../constants";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NetworkModal } from "../modals/NetworkModal";
import { resetWallets, resetWalletsInLocalStorage } from "../store/wallet";
import { Network } from "../types";

import RootView from "./RootView";

const SettingsScreen = () => {
  const networkModalRef = useRef<Modalize>(null);
  const [faceID, setFaceID] = useState<boolean | undefined>(false);
  const dispatch = useAppDispatch();

  const { network } = useAppSelector((state) => state.settings);

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
        <ScrollView style={{ paddingHorizontal: SIZES.padding, backgroundColor: COLORS.black }}>
          {/* APP */}
          <SectionTitle title={"APP"} />
          <Setting
            title={"Appearance"}
            value={"Dark"}
            type={"button"}
            onPress={() => "press"}
            iconType={"down"}
          />
          <Setting
            title={"Network"}
            value={getNetworkName(network)}
            type={"button"}
            onPress={() => networkModalRef.current?.open()}
            iconType={"down"}
          />
          {/* SECURITY */}
          <SectionTitle title={"SECURITY"} />
          <Setting
            title={"FaceID"}
            value={faceID}
            type={"switch"}
            onPress={(value) => setFaceID(value)}
            iconType={"right"}
          />
          <Setting
            title={"Change Password"}
            value={""}
            type={"button"}
            onPress={() => "press"}
            iconType={"right"}
          />
          <Setting
            title={"Multi-Factor Authentication"}
            value={""}
            type={"button"}
            onPress={() => "press"}
            iconType={"right"}
          />
          <Button
            type={"bordered"}
            label={"Reset all wallets"}
            style={{ marginVertical: SIZES.padding }}
            onPress={async () => {
              await resetWalletsInLocalStorage();
              dispatch(resetWallets());
            }}
          />
        </ScrollView>
        <NetworkModal
          ref={networkModalRef}
          network={network}
          onClose={() => networkModalRef.current?.close()}
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
}: {
  title: string;
  value?: string | boolean;
  type: "button" | "switch";
  iconType?: "down" | "right";
  onPress: (value?: boolean) => void;
}) => {
  const iconName = iconType === "down" ? "chevron-down" : "chevron-right";
  if (type === "button") {
    return (
      <TouchableOpacity
        style={{ flexDirection: "row", height: 50, alignItems: "center" }}
        onPress={() => onPress()}
      >
        <Text style={[FONTS.h3, { flex: 1, color: COLORS.white }]}>{title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[FONTS.h3, { marginRight: SIZES.radius, color: COLORS.lightGray3 }]}>
            {value}
          </Text>
          <Feather name={iconName} size={24} color={COLORS.white} />
        </View>
      </TouchableOpacity>
    );
  } else if (type === "switch" && typeof value == "boolean") {
    return (
      <View style={{ flexDirection: "row", height: 50, alignItems: "center" }}>
        <Text style={[FONTS.h3, { flex: 1, color: COLORS.white }]}>{title}</Text>
        <Switch value={value} onValueChange={(value) => onPress(value)} />
      </View>
    );
  } else {
    return null;
  }
};
