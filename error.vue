<template>
  <div class="container p-6 text-center">
    <h1 class="font-bold text-9xl text-destructive">{{ props.error.statusCode }}</h1>
    <h2 class="mb-4 text-2xl">{{ props.error.message }}</h2>
    <Button @click="goToHome">Go to Home</Button>
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

const goToHome = () => clearError({ redirect: '/' });
</script>
