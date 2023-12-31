"use client";

import { createContext, useContext } from "react";
import type { UserInfo } from "firebase/auth";
import { Claims } from "next-firebase-auth-edge/lib/auth/claims";

export interface User extends Omit<UserInfo, "providerId"> {
  emailVerified: boolean;
  customClaims: Claims;
}

export type AuthContextValue = User | null;

export const AuthContext = createContext<AuthContextValue>(null);

export const useAuth = () => useContext(AuthContext);
