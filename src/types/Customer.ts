import { Profile } from "./Profile";
export interface Customer {
  id?: number;
  customerId?: number;
  email: string;
  password: string;
  profile: Profile;
}
