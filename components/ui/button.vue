<template>
  <button
    :type="type"
    :disabled="disabled"
    @click="handleClick"
    class="px-10 py-2 border border-1"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <slot></slot>
  </button>
</template>


<script setup>
defineProps({
type: {
  type: String,
  default: 'button'
},
disabled: {
  type: Boolean,
  default: false
}
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
emit('click', event)
}
</script>