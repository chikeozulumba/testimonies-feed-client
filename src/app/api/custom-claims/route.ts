import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "next-firebase-auth-edge/lib/next/tokens";
import { refreshAuthCookies } from "next-firebase-auth-edge/lib/next/middleware";
import { getFirebaseAuth } from "next-firebase-auth-edge/lib/auth";
import { AUTH_CONFIG } from "@/config/server";

const { setCustomUserClaims, getUser } = getFirebaseAuth(
  AUTH_CONFIG.serviceAccount,
  AUTH_CONFIG.apiKey
);

export async function POST(request: NextRequest) {
  const tokens = await getTokens(request.cookies, AUTH_CONFIG);

  if (!tokens) {
    throw new Error("Cannot update custom claims of unauthenticated user");
  }

  await setCustomUserClaims(tokens.decodedToken.uid, {
    someCustomClaim: {
      updatedAt: Date.now(),
    },
  });

  const user = await getUser(tokens.decodedToken.uid);
  const response = new NextResponse(
    JSON.stringify({
      customClaims: user.customClaims,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );

  // Attach `Set-Cookie` headers with token containing new custom claims
  await refreshAuthCookies(tokens.token, response, AUTH_CONFIG);

  return response;
}
