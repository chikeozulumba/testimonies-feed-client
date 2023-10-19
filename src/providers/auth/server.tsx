import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { cookies } from "next/headers";
import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";
import { Tokens } from "next-firebase-auth-edge/lib/auth";
import { AUTH_CONFIG } from "@/config/server";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "./client";
import { User } from "./context";

const mapTokensToUser = ({ decodedToken }: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
  } = decodedToken;

  const customClaims = filterStandardClaims(decodedToken);

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    customClaims,
  };
};

export async function ServerAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokens = await getTokens(cookies(), AUTH_CONFIG);
  const user = tokens ? mapTokensToUser(tokens) : null;

  return (
    <AuthProvider defaultUser={user}>
      <Navbar />
      {children}
    </AuthProvider>
  );
}
