import { FriendProfile } from "./FriendProfile";
export interface Friend {
  id?: number;
  customerId?: number;
  profile: FriendProfile;
}
