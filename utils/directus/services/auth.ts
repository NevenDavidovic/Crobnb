import { login, logout, refresh, createUser } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
  AuthenticationMode,
} from "@directus/sdk";

import type { Schema } from "~/types/directus/exports/schema";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const AuthService = {
  async registerUser(
    directus: Client,
    userData: {
      email: string;
      password: string;
      first_name?: string;
      last_name?: string;
      telefon?: string;
    }
  ) {
    try {
      console.log("AuthService: Starting registration with data:", {
        email: userData.email,
        // mask password
        password: "********",
        first_name: userData.first_name,
        last_name: userData.last_name,
        telefon: userData.telefon,
      });

      // Create the user data for API
      const userPayload = {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        telefon: userData.telefon,
      };

      console.log("AuthService: Creating user with payload", userPayload);

      // Use the createUser function from the SDK
      const result = await directus.request(createUser(userPayload));

      console.log("AuthService: Registration successful with result:", result);
      return result;
    } catch (error) {
      console.error("AuthService: Registration failed with error:", error);
      // Pass the error up to be handled in the composable
      throw error;
    }
  },

  async loginUser(
    directus: Client,
    credentials: { email: string; password: string }
  ) {
    const mode = "json" as AuthenticationMode;
    return await directus.request(
      login(credentials.email, credentials.password, { mode })
    );
  },

  async logoutUser(directus: Client) {
    return await directus.request(logout());
  },

  async refreshToken(directus: Client, refreshTokenStr: string) {
    const mode = "json" as AuthenticationMode;
    return await directus.request(refresh(mode, refreshTokenStr));
  },
};
