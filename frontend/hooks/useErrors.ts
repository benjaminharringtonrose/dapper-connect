import { useEffect } from "react";
import { Alert } from "react-native";

export const useErrors = (errorsArr: Error[]) => {
  useEffect(() => {
    errorsArr.forEach((error) => {
      if (error) {
        Alert.alert(`Error:`, error?.message);
      }
    });
  }, errorsArr);
};
