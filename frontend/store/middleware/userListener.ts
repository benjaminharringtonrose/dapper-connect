/* eslint-disable @typescript-eslint/ban-types */
import firestore from "@react-native-firebase/firestore";
import { Middleware } from "@reduxjs/toolkit";

import { RootState } from "..";
import { User } from "../../types";
import { errorGetCurrentUser, loadingGetCurrentUser, updateUser } from "../account/slice";

let isListeningToUser = false;
let unsubscribe: () => void | undefined;

export const userListener: Middleware<{}, any> = (store) => (next) => (action) => {
  const result = next(action);
  const stateAfter = store.getState();
  const userId = stateAfter.auth.user?.uid;
  if (userId && !isListeningToUser) {
    isListeningToUser = true;
    store.dispatch(loadingGetCurrentUser());
    unsubscribe = firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot(
        (doc) => {
          const firebaseUser = doc.data();
          store.dispatch(updateUser({ user: firebaseUser as User }));
        },
        (error) => {
          store.dispatch(
            errorGetCurrentUser({
              error: {
                ...error,
                message: "Error getting user",
              },
            })
          );
        }
      );
  } else if (!userId && isListeningToUser) {
    isListeningToUser = false;
    unsubscribe();
  }
  return result;
};
