/* eslint-disable @typescript-eslint/no-namespace */
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { LogBox, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { Host } from "react-native-portalize";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";

import { COLORS } from "./constants";
import { useAppDispatch, useAppSelector } from "./hooks";
import { AppStack, StartupStack } from "./navigation";
import { store } from "./store";
import { frontloadAppRequested } from "./store/settings/slice";

LogBox.ignoreLogs([
  "Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
  "Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
]);

// so I can add my custom colors
declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      border: string;
      activityIndicator: string;
      success: string;
      error: string;
      input: string;
      white: string;
      black: string;
      bottomTabActive: string;
      bottomTabInactive: string;
      textGray: string;
      shadow: string;
    }
  }
}

const Root = () => {
  const { loadingFrontloadApp, colorScheme } = useAppSelector((state) => state.settings);

  const dispatch = useAppDispatch();

  useEffect(() => {
    SplashScreen.hide();
    dispatch(frontloadAppRequested());
  }, []);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      primary: "#0E68B3",
      white: COLORS.white,
      black: COLORS.black,
      background: "#ffffff",
      text: "#000000",
      accent: "#ededed",
      border: "#f2f2f2",
      activityIndicator: "#c6c6c6",
      error: "#b00020",
      success: "#018786",
      input: COLORS.white,
      bottomTabActive: "",
      bottomTabInactive: "#c6c6c6",
      textGray: COLORS.lightGray3,
      transparentBlack: "rgba(0, 0, 0, 0.5)",
      shadow: "#e5e5e5",
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      primary: "#4682b4",
      white: COLORS.white,
      black: COLORS.black,
      background: "#000000",
      text: "#ffffff",
      accent: "#212125",
      border: "#404040",
      activityIndicator: COLORS.white,
      error: "#cf6679",
      success: "#03dac6",
      input: COLORS.gray,
      disabled: COLORS.gray,
      bottomTabActive: "",
      bottomTabInactive: "#4c4c4c",
      textGray: "#a6a6a6",
      transparentBlack: COLORS.transparentBlack,
      shadow: "#191919",
    },
  };

  const theme = colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <NavigationContainer theme={theme}>
        {loadingFrontloadApp ? <StartupStack /> : <AppStack />}
      </NavigationContainer>
    </PaperProvider>
  );
};

const App = () => {
  const [loaded] = useFonts({
    ["Roboto-Black"]: require("../assets/fonts/Roboto-Black.ttf"),
    ["Roboto-BlackItalic"]: require("../assets/fonts/Roboto-BlackItalic.ttf"),
    ["Roboto-Bold"]: require("../assets/fonts/Roboto-Bold.ttf"),
    ["Roboto-BoldItalic"]: require("../assets/fonts/Roboto-BoldItalic.ttf"),
    ["Roboto-Italic"]: require("../assets/fonts/Roboto-Italic.ttf"),
    ["Roboto-Light"]: require("../assets/fonts/Roboto-Light.ttf"),
    ["Roboto-LightItalic"]: require("../assets/fonts/Roboto-LightItalic.ttf"),
    ["Roboto-Medium"]: require("../assets/fonts/Roboto-Medium.ttf"),
    ["Roboto-MediumItalic"]: require("../assets/fonts/Roboto-MediumItalic.ttf"),
    ["Roboto-Regular"]: require("../assets/fonts/Roboto-Regular.ttf"),
    ["Roboto-Thin"]: require("../assets/fonts/Roboto-Thin.ttf"),
    ["Roboto-ThinItalic"]: require("../assets/fonts/Roboto-ThinItalic.ttf"),
    ["RobotoCondensed-Bold"]: require("../assets/fonts/RobotoCondensed-Bold.ttf"),
    ["RobotoCondensed-BoldItalic"]: require("../assets/fonts/RobotoCondensed-BoldItalic.ttf"),
    ["RobotoCondensed-Italic"]: require("../assets/fonts/RobotoCondensed-Italic.ttf"),
    ["RobotoCondensed-Light"]: require("../assets/fonts/RobotoCondensed-Light.ttf"),
    ["RobotoCondensed-LightItalic"]: require("../assets/fonts/RobotoCondensed-LightItalic.ttf"),
    ["RobotoCondensed-Regular"]: require("../assets/fonts/RobotoCondensed-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Host>
            <Root />
          </Host>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
