import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

import { COLORS } from "../constants";

interface BackButtonProps {
  onPress?: () => void;
}

export const BackButton = (props: BackButtonProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Ionicons name={"chevron-back"} color={COLORS.white} size={32} />
    </TouchableOpacity>
  );
};
