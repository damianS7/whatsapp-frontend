import type { User } from "@/types/User";
import { defineStore } from "pinia";
const API = import.meta.env.VITE_APP_API_URL;
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => {
      if (state.token === "") {
        return false;
      }

      return true;
    },
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await fetch(
          `${API}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message || "Invalid credentials.");
        }

        const data = await response.json();
        this.token = data.token;
        localStorage.setItem("token", this.token);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Invalid credentials.");
      }
    },
    async register(fields: User) {
      try {
        const response = await fetch(
          `${API}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fields),
          }
        );

        // if response is not 201, throw an error
        if (response.status !== 201) {
          const error = await response.json();
          throw new Error(error.message || "Registration failed.");
        }

        const data = await response.json();
        return { status: response.status, data };
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Registration failed.");
      }
    },
    async isTokenValid(token: string) {
      try {
        const response = await fetch(
          `${API}/auth/token/validate`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if response is not 200, throw an error
        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message || "Token validation failed.");
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Token validation failed.");
      }
    },
    async logout() {
      this.token = "";
      this.initialized = false;
      localStorage.clear();
    },
    async initialize() {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        this.token = savedToken;

        await this.isTokenValid(savedToken).catch(() => {
          this.logout();
          return;
        });
      }
      this.initialized = true;
    },
  },
});
