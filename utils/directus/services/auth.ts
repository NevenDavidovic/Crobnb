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

  async requestPasswordReset(
    directus: Client,
    email: string,
    resetUrl?: string
  ) {
    try {
      // Use runtime config to get the base URL
      const config = useRuntimeConfig();
      const appBaseUrl = config.public.appUrl || "http://localhost:3000";

      const finalResetUrl = resetUrl || `${appBaseUrl}/reset-password`;

      return await directus.request(passwordRequest(email, finalResetUrl));
    } catch (error: any) {
      console.error("Password reset request failed:", error);

      if (error.message && typeof error.message === "string") {
        if (
          error.message.includes("authorized recipients") ||
          (error.response?.data?.errors?.[0]?.message || "").includes(
            "authorized recipients"
          )
        ) {
          throw new Error(
            "Email servis trenutno nije u mogućnosti poslati email na ovu adresu. Molimo kontaktirajte administratora."
          );
        }

        if (
          error.message.includes("user not found") ||
          error.response?.status === 404
        ) {
          throw new Error("Korisnik s ovom email adresom nije pronađen.");
        }
      }

      throw error;
    }
  },

  async resetPassword(directus: Client, token: string, password: string) {
    try {
      return await directus.request(passwordReset(token, password));
    } catch (error: any) {
      console.error("Password reset failed:", error);

      // Enhanced error handling
      if (error.message && typeof error.message === "string") {
        // Check for invalid token
        if (
          error.message.includes("token is invalid") ||
          error.message.includes("token expired") ||
          error.response?.status === 400
        ) {
          throw new Error(
            "Token za resetiranje lozinke nije valjan ili je istekao. Molimo zatražite novi link za reset."
          );
        }

        // Check for password policy
        if (error.message.includes("password validation")) {
          throw new Error(
            "Lozinka ne zadovoljava sigurnosne uvjete. Koristite barem 8 znakova, uključujući velika i mala slova, brojeve i specijalne znakove."
          );
        }
      }

      // If we don't have a specific error to transform, just re-throw
      throw error;
    }
  },
};
