<template>
  <div class="flex items-center justify-center flex-1 h-full p-6 text-center">
    <section>
      <h1 class="mb-5 text-4xl font-bold text-primary">Hello world!</h1>
      <div class="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" @click="store.decrementCounter"
          >-1</Button
        >
        <label class="w-10">{{ store.counter }}</label>
        <Button variant="secondary" size="sm" @click="store.incrementCounter"
          >+1</Button
        >
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";

const store = useMainStore();
</script>
