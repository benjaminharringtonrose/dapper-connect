import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { LogBox, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Host } from "react-native-portalize";
import { Provider } from "react-redux";

import { useAppDispatch, useAppSelector } from "./hooks";
import { AppStack, AuthStack, StartupStack } from "./navigation";
import { store } from "./store";
import { setAuthUser } from "./store/auth/slice";
import { frontloadAppRequested } from "./store/settings/slice";
import { AuthUser } from "./types";

LogBox.ignoreLogs([
  "Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
  "Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
]);

const Root = () => {
  const { loadingFrontloadApp } = useAppSelector((state) => state.settings);

  const dispatch = useAppDispatch();

  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUser | undefined>(undefined);

  useEffect(() => {
    dispatch(frontloadAppRequested());
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onAuthStateChanged = async (firebaseUser: FirebaseAuthTypes.User | null) => {
    try {
      let authUser: AuthUser | undefined = undefined;
      if (firebaseUser) {
        authUser = {
          emailVerified: firebaseUser.emailVerified,
          uid: firebaseUser.uid,
          providerId: firebaseUser.providerId,
          providerData: firebaseUser.providerData,
          displayName: firebaseUser.displayName || undefined,
          email: firebaseUser.email || undefined,
          isAnonymous: firebaseUser.isAnonymous,
          photoURL: firebaseUser.photoURL || undefined,
          metadata: firebaseUser.metadata,
        };
        dispatch(setAuthUser({ user: authUser }));
      }
      setUser(authUser);
      if (initializing) {
        setInitializing(false);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  if (initializing) return null;

  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <NavigationContainer theme={DarkTheme}>
        {loadingFrontloadApp ? <StartupStack /> : user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </>
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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Host>
          <Root />
        </Host>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
