import { useUserStore } from "@/stores/user";
import type { User } from "@/types/User";

export function authUtils() {
  const isLoggedUser = (userId: number) => {
    const user: User = useUserStore().getLoggedUser;
    if (user.id === userId) {
      return true;
    }
    return false;
  };

  return {
    isLoggedUser,
  };
}
