import { User } from "firebase/auth";

export type AuthState = {
  loading: boolean;
  isLoggedInCheck: boolean;
  authenticated?: boolean;
  token?: string;
};

export type Auth = {
  uid: string;
  email?: string;
  name?: string;
  avatar?: string;
  token?: string;
  authenticated?: boolean;
};

export type Profile = {
  avatar?: string;
  countryId: string | null;
  createdAt: string;
  email: string;
  emailVerifiedAt: string | null;
  firstName: string | null;
  flagged: boolean;
  id: string;
  lastName: string | null;
  name: string;
  phoneNumber: string | null;
  provider: string;
  rating: number;
  reported: boolean;
  status: "active" | "inactive" | "suspended" | "deleted";
  uid: string;
  updatedAt: string;
  username: string;
};

export type AuthorizeUserRequest = {
  uid: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: string;
};

export type SignUpWithSocialAccountProvider =
  | AUTH_PROVIDERS.Facebook
  | AUTH_PROVIDERS.Google
  | AUTH_PROVIDERS.Twitter;

export type CreateWishlistRequest = {
  title?: string;
  description?: string;
  visibility: string;
  deadline?: string | Date;
  password?: string;
};

export type Wishlist = {
  id: string;
  title: string;
  slug: string;
  description: string;
  visibility: string;
  isFavorite: boolean;
  coverPhoto?: string;
  coverPhotoColor?: string;
  coverPhotoSource?: string;
  deadline: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type UpdateWishlistRequest = Omit<
  Partial<Wishlist>,
  | "id"
  | "slug"
  | "createdAt"
  | "updatedAt"
  | "coverPhotoSource"
  | "coverPhotoColor"
  | "coverPhotoUrl"
>;

export type CreateWishlistResponse = {
  statusCode: number;
  status: "success" | "error";
  data: Wishlist;
};

export type Response<T = any> = {
  statusCode: number;
  status: "success" | "error";
  data: T;
};

export type BaseLayoutProps = {
  layoutWidth?: "default" | "wide" | string;
};
