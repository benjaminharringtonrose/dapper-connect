import React, { useState } from "react";
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

import { HeaderBar } from "../components";
import { COLORS, FONTS, icons, mockData, SIZES } from "../constants";

import RootView from "./RootView";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <View style={{ marginTop: SIZES.padding }}>
      <Text style={[FONTS.h4, { color: COLORS.lightGray3 }]}>{title}</Text>
    </View>
  );
};

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

const ProfileScreen = () => {
  const [faceID, setFaceID] = useState<boolean | undefined>(false);
  return (
    <RootView>
      <View style={{ flex: 1, paddingHorizontal: SIZES.padding, backgroundColor: COLORS.black }}>
        {/* Header */}
        <HeaderBar title={"Profile"} />
        {/* Details */}
        <ScrollView>
          {/* Email & User ID Row */}
          <View style={{ flexDirection: "row", marginTop: SIZES.radius }}>
            <View style={{ flex: 1 }}>
              <Text style={[FONTS.h3, { color: COLORS.white }]}>{mockData.mockProfile.email}</Text>
              <Text
                style={[FONTS.body4, { color: COLORS.lightGray3 }]}
              >{`ID: ${mockData.mockProfile.id}`}</Text>
            </View>
            {/* Status */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={icons.verified} style={{ width: 25, height: 25 }} />
              <Text style={[FONTS.body4, { color: COLORS.lightGreen }]}>{"Verified"}</Text>
            </View>
          </View>
          {/* APP */}
          <SectionTitle title={"APP"} />
          <Setting
            title={"Launch Screen"}
            value={"Home"}
            type={"button"}
            onPress={() => console.log("press")}
          />
          <Setting
            title={"Appearance"}
            value={"Dark"}
            type={"button"}
            onPress={() => console.log("press")}
          />
          {/* ACCOUNT */}
          <SectionTitle title={"ACCOUNT"} />
          <Setting
            title={"Payment Currency"}
            value={"USD"}
            type={"button"}
            onPress={() => console.log("press")}
          />
          <Setting
            title={"Language"}
            value={"English"}
            type={"button"}
            onPress={() => console.log("press")}
          />
          {/* SECURITY */}
          <SectionTitle title={"SECURITY"} />
          <Setting
            title={"FaceID"}
            value={faceID}
            type={"switch"}
            onPress={(value) => setFaceID(value)}
          />
          <Setting
            title={"Password Settings"}
            value={""}
            type={"button"}
            onPress={() => console.log("press")}
          />
          <Setting
            title={"Change Password"}
            value={""}
            type={"button"}
            onPress={() => console.log("press")}
          />
          <Setting
            title={"Multi-Factor Authentication"}
            value={""}
            type={"button"}
            onPress={() => console.log("press")}
          />
        </ScrollView>
      </View>
    </RootView>
  );
};

export default ProfileScreen;
