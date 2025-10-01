import type { GenderType } from "@/types/User";

export interface UserRegisterRequest {
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  gender: GenderType;
}
