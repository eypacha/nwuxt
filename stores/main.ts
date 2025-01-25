export const useMainStore = defineStore("main", () => {
  const counter = ref(0);

  function incrementCounter() {
    counter.value++;
  }

  function decrementCounter() {
    counter.value--;
  }

  return {
    counter,
    incrementCounter,
    decrementCounter,
  };
});
