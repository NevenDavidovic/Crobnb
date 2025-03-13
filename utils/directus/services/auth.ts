import { createUser } from "@directus/sdk";
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
      // This will ensure the role is included
      const result = await directus.request(createUser(userPayload));

      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },
};
