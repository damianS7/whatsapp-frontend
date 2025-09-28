import type { JwtPayload } from "@/types/JwtPayload";
import type { UserRegisterRequest } from "@/types/UserRegisterRequest";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authService } from "@/services/authService";

export const useAuthStore = defineStore("auth", () => {
  const token = ref("");
  const initialized = ref(false);

  const isAuthenticated = computed(() => token.value !== "");

  async function initialize() {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      return;
    }

    if (!authService.validateToken(storedToken)) {
      logout();
      return;
    }

    token.value = storedToken;
    initialized.value = true;
  }

  async function login(email: string, password: string) {
    try {
      const jwtToken = await authService.login(email, password);
      token.value = jwtToken;
      localStorage.setItem("token", jwtToken);
    } catch (error) {
      throw error;
    }
  }

  async function register(fields: UserRegisterRequest) {
    return await authService.register(fields);
  }

  async function isTokenValid(token: string): Promise<boolean> {
    return await authService.validateToken(token);
  }

  async function logout() {
    token.value = "";
    initialized.value = false;
    localStorage.clear();
  }

  function getPayload() {
    const token = localStorage.getItem("token");
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  return {
    token,
    initialized,
    isAuthenticated,
    login,
    register,
    logout,
    initialize,
    getPayload,
    isTokenValid,
  };
});


// export const useAuthStore = defineStore("auth", {

//   actions: {
//     async login(email: string, password: string) {
//       try {
//         const response = await fetch(
//           `${API}/auth/login`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//           }
//         );

//         // if response is not 200, throw an error
//         if (response.status !== 200) {
//           const error = await response.json();
//           throw new Error(error.message || "Invalid credentials.");
//         }

//         const data = await response.json();
//         this.token = data.token;
//         localStorage.setItem("token", this.token);
//       } catch (error) {
//         if (error instanceof Error) {
//           throw error;
//         }
//         throw new Error("Invalid credentials.");
//       }
//     },
//     async register(fields: UserRegisterRequest) {
//       try {
//         const response = await fetch(
//           `${API}/auth/register`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(fields),
//           }
//         );

//         // if response is not 201, throw an error
//         if (response.status !== 201) {
//           const error = await response.json();
//           throw new Error(error.message || "Registration failed.");
//         }

//         const data = await response.json();
//         return { status: response.status, data };
//       } catch (error) {
//         if (error instanceof Error) {
//           throw error;
//         }
//         throw new Error("Registration failed.");
//       }
//     },
//     async isTokenValid(token: string) {
//       try {
//         const response = await fetch(
//           `${API}/auth/token/validate`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         // if response is not 200, throw an error
//         if (response.status !== 200) {
//           const error = await response.json();
//           throw new Error(error.message || "Token validation failed.");
//         }
//       } catch (error) {
//         if (error instanceof Error) {
//           throw error;
//         }
//         throw new Error("Token validation failed.");
//       }
//     },
//     async logout() {
//       this.token = "";
//       this.initialized = false;
//       localStorage.clear();
//     },
//     getPayload() {
//     const token = localStorage.getItem("token");
//     return token ? jwtDecode<JwtPayload>(token) : null;
//   },
//     async initialize() {
//       const savedToken = localStorage.getItem("token");
//       if (savedToken) {
//         this.token = savedToken;

//         await this.isTokenValid(savedToken).catch(() => {
//           this.logout();
//           return;
//         });
//       }
//       this.initialized = true;
//     },
//   },
// });
