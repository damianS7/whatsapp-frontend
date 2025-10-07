import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import LoginView from "@/views/auth/LoginView.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import RegisterView from "@/views/accounts/RegisterView.vue";
import SettingsView from "@/views/settings/SettingsView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import GroupListView from "@/views/groups/GroupListView.vue";
import ChatView from "@/views/chat/ChatView.vue";
import ContactListView from "@/views/contacts/ContactListView.vue";
import { useAuthStore } from "@/stores/auth";
import GroupEditView from "@/views/groups/GroupEditView.vue";
import VerificationView from "@/views/accounts/verification/VerificationView.vue";
import ResendVerificationView from "@/views/accounts/verification/ResendVerificationView.vue";
import ResetPasswordView from "@/views/accounts/password/reset/ResetPasswordView.vue";
import ResetPasswordSetView from "@/views/accounts/password/reset/ResetPasswordSetView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    redirect: "/chats",
    children: [
      {
        path: "groups",
        name: "groups",
        component: GroupListView,
      },
      {
        path: "groups/:id",
        name: "group",
        component: GroupEditView,
      },
      {
        path: "chats",
        name: "chats",
        component: ChatView,
      },
      {
        path: "contacts",
        name: "contacts",
        component: ContactListView,
      },
      {
        path: "profile",
        name: "profile",
        component: ProfileView,
      },
      {
        path: "settings",
        name: "settings",
        component: SettingsView,
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    redirect: "/auth/login",
    meta: { redirectIfLogged: true },
    children: [
      {
        path: "login",
        name: "login",
        component: LoginView,
      },
      {
        path: "register",
        name: "register",
        component: RegisterView,
      },
    ],
  },
  {
    path: "/accounts",
    component: AuthLayout,
    meta: { redirectIfLogged: true },
    children: [
      {
        path: "verification/:token?",
        name: "verify-account",
        component: VerificationView,
      },
      {
        path: "verification/resend",
        name: "resend-verification",
        component: ResendVerificationView,
      },
      {
        path: "password/reset",
        name: "reset-password",
        component: ResetPasswordView,
      },
      {
        path: "password/reset/:token",
        name: "reset-password-set",
        component: ResetPasswordSetView,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  await authStore.initialize();
  const isAuthenticated = authStore.isAuthenticated;

  // if authentication is required but you are not logged
  if (to.meta.requiresAuth && !isAuthenticated) {
    // redirect to login
    return next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }

  // if you access to /auth being logged ...
  if (to.meta.redirectIfLogged && isAuthenticated) {
    // redirects to /
    return next({
      path: "/",
    });
  }

  // from now on you are authenticated
  // if the route requires a role ...
  if (to.meta.role) {
    // get the user role
    const role = authStore.getPayload()?.role || "USER";

    // compare them
    if (role !== to.meta.role) {
      return next({
        path: "/404",
      });
    }
  }

  next();
});
export default router;
