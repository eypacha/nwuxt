<template>
  <header class="flex items-center justify-between p-3 bg-secondary">
    <div>{{ appTitle }}</div>
    <ColorModeSelector/>
  </header>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const appTitle = config.public.appTitle;
</script>