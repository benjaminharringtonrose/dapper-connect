import React, { useState } from "react";
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

import { Button, SectionTitle } from "../components";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppDispatch } from "../hooks";
import { resetWallets, resetWalletsInLocalStorage } from "../store/wallet";

import RootView from "./RootView";

const Setting = ({
  title,
  value,
  type,
  onPress,
}: {
  title: string;
  value?: string | boolean;
  type: "button" | "switch";
  onPress: (value?: boolean) => void;
}) => {
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
          <Image
            source={icons.rightArrow}
            style={{ height: 15, width: 15, tintColor: COLORS.white }}
          />
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

const SettingsScreen = () => {
  const [faceID, setFaceID] = useState<boolean | undefined>(false);
  const dispatch = useAppDispatch();

  return (
    <RootView>
      <View style={{ flex: 1 }}>
        {/* Details */}
        <ScrollView style={{ paddingHorizontal: SIZES.padding, backgroundColor: COLORS.black }}>
          {/* APP */}
          <SectionTitle title={"APP"} />
          <Setting title={"Appearance"} value={"Dark"} type={"button"} onPress={() => "press"} />
          <Setting title={"Network"} value={"Mainnet"} type={"button"} onPress={() => "press"} />
          {/* SECURITY */}
          <SectionTitle title={"SECURITY"} />
          <Setting
            title={"FaceID"}
            value={faceID}
            type={"switch"}
            onPress={(value) => setFaceID(value)}
          />
          <Setting title={"Change Password"} value={""} type={"button"} onPress={() => "press"} />
          <Setting
            title={"Multi-Factor Authentication"}
            value={""}
            type={"button"}
            onPress={() => "press"}
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
      </View>
    </RootView>
  );
};

export default SettingsScreen;
