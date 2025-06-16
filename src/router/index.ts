import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "@/views/auth/LoginView.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import SettingsView from "@/views/settings/SettingsView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import ResetPasswordView from "@/views/auth/ResetPasswordView.vue";
import GroupListView from "@/views/groups/GroupListView.vue";
import ContactListView from "@/views/contacts/ContactListView.vue";
import { useAuthStore } from "@/stores/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "groups",
        name: "groups",
        component: GroupListView,
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
      {
        path: "reset-password",
        name: "reset-password",
        component: ResetPasswordView,
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
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
