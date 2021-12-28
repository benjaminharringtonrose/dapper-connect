/* eslint-disable no-empty */
/* eslint-disable require-yield */
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { call, put, takeLatest } from "redux-saga/effects";

import { AuthUser, FirebaseUser } from "../../types";
import {
  signInFailed,
  signInRequested,
  SignInRequestedAction,
  signInSucceeded,
  signOutRequested,
  signUpFailed,
  signUpRequested,
  SignUpRequestedAction,
  signUpSucceeded,
} from "../auth/slice";

function* signInSaga(action: SignInRequestedAction) {
  const { email, password } = action.payload;
  const firebaseAuth = auth();
  try {
    const response: FirebaseAuthTypes.UserCredential = yield call(
      [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
      email,
      password
    );
    let authUser: AuthUser | undefined = undefined;
    const firebaseUser = response.user;
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
    yield put(signInSucceeded({ user: authUser }));
  } catch (error) {
    yield put(signInFailed({ error }));
  }
}

function* signUpSaga(action: SignUpRequestedAction) {
  const { email, password } = action.payload;
  try {
    const firebaseAuth = auth();
    yield console.log("signup saga");
    const response: FirebaseAuthTypes.UserCredential = yield call(
      [firebaseAuth, firebaseAuth.createUserWithEmailAndPassword],
      email,
      password
    );
    let authUser: AuthUser | undefined = undefined;
    const firebaseUser = response.user;
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
    yield firestore()
      .collection("users")
      .doc(firebaseUser.uid)
      .set({ uid: firebaseUser.uid, email });
    yield put(signUpSucceeded({ user: authUser }));
  } catch (error) {
    console.warn(error);
    yield put(signUpFailed({ error }));
  }
}

function* signOutSaga() {
  try {
  } catch (e) {}
}

function* authSaga() {
  yield takeLatest(signInRequested.type, signInSaga);
  yield takeLatest(signUpRequested.type, signUpSaga);
  yield takeLatest(signOutRequested.type, signOutSaga);
}

export default authSaga;
