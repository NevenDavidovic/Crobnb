import {
  createUser,
  readMe,
  passwordRequest,
  passwordReset,
  logout,
  refresh,
} from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
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
      role: string;
    }
  ) {
    const userPayload = {
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name,
      telefon: userData.telefon,
      role: userData.role,
    };
    return await directus.request(createUser(userPayload));
  },

  async getCurrentUser(directus: Client) {
    return await directus.request(
      readMe({
        fields: ["*"],
      })
    );
  },

  async loginUser(
    directus: Client,
    credentials: { email: string; password: string }
  ) {
    return await directus.login(credentials.email, credentials.password, {
      mode: "json",
    });
  },

  async logoutUser(directus: Client, refreshToken?: string) {
    if (refreshToken) {
      return await directus.request(logout(refreshToken, "json"));
    } else {
      return Promise.resolve();
    }
  },

  async refreshToken(directus: Client, refreshToken?: string) {
    if (refreshToken) {
      return await directus.request(refresh("json", refreshToken));
    } else {
      return await directus.refresh();
    }
  },

  async requestPasswordReset(
    directus: Client,
    email: string,
    resetUrl?: string
  ) {
    const config = useRuntimeConfig();
    const appBaseUrl = config.public.appUrl || "http://localhost:3000";
    const finalResetUrl = resetUrl || `${appBaseUrl}/reset-password`;
    return await directus.request(passwordRequest(email, finalResetUrl));
  },

  async resetPassword(directus: Client, token: string, password: string) {
    return await directus.request(passwordReset(token, password));
  },
};
