<template>
  <footer class="flex items-center justify-between p-4 text-sm bg-secondary">
    <span>&copy; {{ currentYear }} {{ appTitle }}</span>
    <a
      href="https://github.com/eypacha/nuwxt"
      target="_blank"
      class="text-2xl"
      aria-label="Visit Nwuxt GitHub repository"
      ><Icon name="uil:github" aria-hidden="true"
    /></a>
  </footer>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const appTitle = config.public.appTitle;
const currentYear = new Date().getFullYear();
</script>