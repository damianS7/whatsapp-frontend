import { useUserStore } from "@/stores/user";
import type { User } from "@/types/User";

export function userUtils() {
  const userStoragePath = (suffix: string) => {
    const user: User = useUserStore().getLoggedUser;
    return user.email.toLocaleLowerCase() + "_" + suffix;
  };

  return {
    userStoragePath,
  };
}
