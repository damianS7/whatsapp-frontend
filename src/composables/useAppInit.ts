import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useGroupStore } from "@/stores/group";
import { useContactStore } from "@/stores/contact";
import { useChatStore } from "@/stores/chat";
import { useUserStore } from "@/stores/user";
import { useSpinnerStore } from "@/stores/spinner";
import { useRouter } from "vue-router";
// import { useSettingStore } from "@/stores/setting";
// import { useNotificationStore } from "@/stores/notification";

export function useAppInit() {
  const screenSpinner = useSpinnerStore();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const groupStore = useGroupStore();
  const chatStore = useChatStore();
  const contactStore = useContactStore();
  // const settingStore = useSettingStore();
  // const notificationStore = useNotificationStore();
  const router = useRouter();
  const tokenValidationInterval = 60 * 1000; // 60s
  let interval: NodeJS.Timeout;
  let initialized = ref(false);

  // functions
  async function checkIfTokenIsValid() {
    const token = authStore.token;
    const isTokenValid = await authStore.isTokenValid(token);

    if (!isTokenValid) {
      initialized.value = false;
      await authStore.logout();
      await wait(100);
      router.push("/auth/login");
    }
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function wait(ms: number) {
    await sleep(ms);
  }

  function isInitialized() {
    return initialized.value;
  }

  onMounted(async () => {
    screenSpinner.show();
    interval = setInterval(async () => {
      await checkIfTokenIsValid();
    }, tokenValidationInterval);

    await userStore.initialize();
    await groupStore.initialize();
    await contactStore.initialize();
    await chatStore.initialize();
    // await settingStore.initialize();
    // await notificationStore.initialize();
    initialized.value = true;
    screenSpinner.hide();
  });
  onUnmounted(() => {
    clearInterval(interval);
  });

  return { isInitialized };
}
