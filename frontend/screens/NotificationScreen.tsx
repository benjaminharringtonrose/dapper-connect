import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

import { FONTS, SIZES } from "../constants";

import RootView from "./RootView";

const NotificationScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity
            style={{ paddingLeft: SIZES.radius }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name={"close"} size={24} color={colors.primary} />
          </TouchableOpacity>
        );
      },
    });
  }, []);

  return (
    <RootView>
      <FlatList
        keyExtractor={(item) => item.id}
        data={[
          { id: "gj23g4jhg23j4hg", message: "Here a message about a thing" },
          { id: "gjhgjhg23jhgjh234gjh234", message: "Here another message about a thing" },
        ]}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                minHeight: 70,
                justifyContent: "center",
                paddingHorizontal: SIZES.radius,
                borderBottomColor: colors.border,
                borderBottomWidth: 1,
              }}
            >
              <View>
                <Text style={[FONTS.h4, { color: colors.text }]}>{item.message}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </RootView>
  );
};

export default NotificationScreen;
