import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  UserCredential,
  OAuthCredential,
} from "firebase/auth";
import { SignUpWithSocialAccountProvider } from "../../../definition";
import { FirebaseAuth } from ".";


export const signUpWithSocialAccount = async (
  providerName: SignUpWithSocialAccountProvider
) => {
  let result: OAuthCredential | UserCredential | null = null;
  let error;

  const Provider = loadProvider(providerName);

  try {
    if (!Provider) {
      throw Error("Invalid provider selected");
    }

    const provider = new Provider();
    let { user, ...credentials } = await signInWithPopup(
      FirebaseAuth,
      provider
    );

    Provider.credentialFromResult({
      user,
      ...credentials,
    });

    return { response: user, error: null };
  } catch (e) {
    console.log(e);
    error = e;
    return { response: null, error };
  }
};

const loadProvider = (provider: string) => {
  switch (provider) {
    case "facebook":
      return FacebookAuthProvider;
    case "google":
      return GoogleAuthProvider;
    case "twitter":
      return TwitterAuthProvider;

    default:
      return null;
  }
};
