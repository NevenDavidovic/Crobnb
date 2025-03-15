import { createUser, readMe } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import { logout, refresh } from "@directus/sdk";

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
      role: string;
    }
  ) {
    try {
      const userPayload = {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        telefon: userData.telefon,
        role: userData.role,
      };

      // Create a user with the SDK's createUser function
      const result = await directus.request(createUser(userPayload));

      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  async getCurrentUser(directus: Client) {
    try {
      const result = await directus.request(
        readMe({
          fields: ["*"],
        })
      );

      return result;
    } catch (error) {
      console.error("Failed to get current user:", error);
      throw error;
    }
  },

  async loginUser(
    directus: Client,
    credentials: { email: string; password: string }
  ) {
    try {
      const result = await directus.login(
        credentials.email,
        credentials.password,
        { mode: "json" }
      );
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async logoutUser(directus: Client, refreshToken?: string) {
    try {
      if (refreshToken) {
        return await directus.request(logout(refreshToken, "json"));
      } else {
        console.error("No refresh token provided for logout");

        return Promise.resolve();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  async refreshToken(directus: Client, refreshToken?: string) {
    try {
      if (refreshToken) {
        return await directus.request(refresh("json", refreshToken));
      } else {
        return await directus.refresh();
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  },
};
