<template>
  <div class="w-32">
    <Select v-model="$colorMode.preference">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ref } from "vue";
import { useColorMode } from "@vueuse/core";

const colorMode = useColorMode();
const selectedMode = ref(colorMode.preference);

watchEffect(() => {
  selectedMode.value = colorMode.value;
});
</script>
