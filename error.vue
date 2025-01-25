<template>
  <div class="container flex p-6 h-[100svh] flex-col items-center justify-center text-center">
    <div>
      <h1 class="font-bold text-9xl text-primary">
        {{ props.error.statusCode }}
      </h1>
      <h2 class="mb-12 text-2xl">{{ props.error.message }}</h2>
      <Button @click="goToHome">Go to Home</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
  default: () => ({ statusCode: 500, message: "Internal Server Error" }),
});

const goToHome = () => clearError({ redirect: "/" });
</script>
