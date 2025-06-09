import { ref } from "vue";

export function createModal<T = any>() {
  const visible = ref(false);
  const data = ref<T | null>(null);
  let resolver: (value: T | null) => void;

  function open(): Promise<T | null> {
    visible.value = true;
    return new Promise((resolve) => {
      resolver = resolve;
    });
  }

  function confirm(value: T) {
    visible.value = false;
    resolver?.(value);
  }

  function cancel() {
    visible.value = false;
    resolver?.(null);
  }

  return {
    visible,
    data,
    open,
    confirm,
    cancel,
  };
}
