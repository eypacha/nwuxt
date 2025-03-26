
<template>
    <input 
        :value="modelValue"
        @input="updateValue"
        :type="type" 
        :placeholder="placeholder"
        class="p-2 bg-transparent border rounded-none border-1 focus:outline-none focus:border-blue-500"
    />
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>