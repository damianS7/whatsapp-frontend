export type GenderType = "MALE" | "FEMALE";
export interface User {
  id: number;
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  gender: GenderType;
  avatarFilename: string;
}
