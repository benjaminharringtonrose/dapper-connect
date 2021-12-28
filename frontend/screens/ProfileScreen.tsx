import auth from "@react-native-firebase/auth";
import React, { useState } from "react";
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

import { Button } from "../components/Button";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAppSelector } from "../hooks";

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

  const { user } = useAppSelector((state) => state.auth);

  const logOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <RootView>
      <View style={{ flex: 1 }}>
        {/* Details */}
        <ScrollView style={{ paddingHorizontal: SIZES.padding, backgroundColor: COLORS.black }}>
          {/* Email & User ID Row */}
          <View style={{ flexDirection: "row", marginTop: SIZES.padding }}>
            <View style={{ flex: 1 }}>
              <Text style={[FONTS.h3, { color: COLORS.white }]}>{user?.email}</Text>
              {/* <Text
                style={[FONTS.body4, { color: COLORS.lightGray3 }]}
              >{`ID: ${mockData.mockProfile.id}`}</Text> */}
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
            title={"Appearance"}
            value={"Dark"}
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
          <Button
            type={"bordered"}
            label={"Log Out"}
            style={{ marginVertical: SIZES.padding }}
            onPress={logOut}
          />
        </ScrollView>
      </View>
    </RootView>
  );
};

export default ProfileScreen;
