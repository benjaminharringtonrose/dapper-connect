/* eslint-disable @typescript-eslint/no-namespace */
import { KOVAN_API, MAINNET_API } from "@env";
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
import Web3 from "web3";

import { COLORS } from "./constants";
import { useAppDispatch, useAppSelector } from "./hooks";
import { AppStack, StartupStack } from "./navigation";
import { store } from "./store";
import { frontloadAppRequested } from "./store/settings/slice";

LogBox.ignoreLogs([
  "The provided value 'ms-stream' is not a valid 'responseType'",
  "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'",
]);

const serverEndpoint =
  store?.getState?.()?.settings?.network === "mainnet" ? MAINNET_API : KOVAN_API;
const provider = new Web3.providers.HttpProvider(serverEndpoint);

console.log("store?.getState?.()?.settings?.network:", store?.getState?.()?.settings?.network);

export const web3: Web3 = new Web3(provider);

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
      modalHandle: string;
      modal: string;
      translucent: string;
      button: string;
    }
  }
}

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
    backdrop: "#ededed",
    modal: COLORS.white,
    modalHandle: COLORS.white,
    button: "#0E68B3",
    translucent: "rgba(255, 255, 255, 0.9)",
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
    success: "#50c878",
    input: "#262626",
    disabled: COLORS.gray,
    bottomTabActive: "",
    bottomTabInactive: "#4c4c4c",
    textGray: "#a6a6a6",
    transparentBlack: COLORS.transparentBlack,
    shadow: "#191919",
    backdrop: COLORS.black,
    modal: "#191919",
    modalHandle: COLORS.white,
    button: COLORS.white,
    translucent: "rgba(25, 25, 25, 0.9)",
  },
};

const Root = () => {
  const { loadingFrontloadApp, colorScheme, authenticated } = useAppSelector(
    (state) => state.settings
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    SplashScreen.hide();
    dispatch(frontloadAppRequested());
  }, []);

  const theme = colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      <NavigationContainer theme={theme}>
        {loadingFrontloadApp || !authenticated ? <StartupStack /> : <AppStack />}
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
