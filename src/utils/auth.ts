import { useUserStore } from "@/stores/user";
import type { User } from "@/types/User";

export function authUtils() {
  const isCurrentUserOwner = (customerId: number) => {
    const customer: User = useUserStore().getLoggedUser;
    if (customer.id === customerId) {
      return true;
    }
    return false;
  };

  const isLoggedUser = (userId: number) => {
    const user: User = useUserStore().getLoggedUser;
    if (user.id === userId) {
      return true;
    }
    return false;
  };

  return {
    isCurrentUserOwner,
    isLoggedUser,
  };
}
