import {
  FirebaseApp,
  FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { FirebaseAuth } from "@/lib/firebase";

export const useFirebaseAuth = () => {
  const auth = FirebaseAuth;

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
    (auth as unknown as any)._canInitEmulator = true;
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_EMULATOR_HOST, {
      disableWarnings: true,
    });
  }

  return { auth };
};
