import "dotenv/config";
import * as child_process from "child_process";

import * as fs from "fs-extra";

// Uncommment to rename the application binaries on postinstall.
//const {APP_DISPLAY_NAME} = process.env;
//child_process.execSync(
//  `npx react-native-rename ${APP_DISPLAY_NAME}`,
//  {stdio: 'inherit'}
//);

// Uncommment to regenerate the application icon on postinstall.
//child_process.execSync(
//  'npx app-icon generate -i assets/image/app-icon.png --platforms=android,ios',
//  {stdio: 'inherit'}
//);

const PROJECT_ROOT = ".";

function removeBadNodeModules() {
  const gestureHandlerDir = `${PROJECT_ROOT}/node_modules/@rainbow-me/animated-charts/node_modules/react-native-gesture-handler`;
  const gestureHandlerDirExists = fs.existsSync(gestureHandlerDir);

  if (gestureHandlerDirExists) {
    fs.removeSync(gestureHandlerDir);
    console.log(`Removed ${gestureHandlerDir}`);
  } else {
    console.log(`${gestureHandlerDir} not found. Ignoring.`);
  }

  const reactNativeSvgDir = `${PROJECT_ROOT}/node_modules/@walletconnect/react-native-dapp/node_modules/react-native-svg`;
  const reactNativeSvgDirExists = fs.existsSync(reactNativeSvgDir);

  if (reactNativeSvgDirExists) {
    fs.removeSync(reactNativeSvgDir);
    console.log(`Removed ${reactNativeSvgDir}`);
  } else {
    console.log(`${reactNativeSvgDir} not found. Ignoring.`);
  }
}

removeBadNodeModules();

child_process.execSync("npx patch-package", { stdio: "inherit" });

// Uncomment to reinstall pods on postinstall.
// import {macos} from 'platform-detect';
// if (macos) {
//   child_process.execSync('npx pod-install', { stdio: 'inherit' });
// }
