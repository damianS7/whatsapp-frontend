import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const visible = ref(false);
  const component = ref<null | string>(null);
  const props = ref<any>(null);
  let resolver: (value: any) => void;

  function open(name: string, newProps: any) {
    visible.value = true;
    component.value = name;
    props.value = newProps;

    return new Promise((resolve) => {
      resolver = resolve;
    });
  }

  function resolve(result: any) {
    if(!component.value) return;
    resolver?.(result);
    component.value = null;
    props.value = null;
    visible.value = false;
  }

  return { component, props, open, resolve, visible };
});
