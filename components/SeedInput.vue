<template>
  <div class="seed-input-container">
    <div class="flex items-center space-x-2">
      <label class="text-sm font-medium">{{ label }}:</label>
      <uiText 
        v-model="seed"
        placeholder="Enter seed value"
      />
      <uiButton @click="generateNewSeed">
        Plant
      </uiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { createRandom, SeededRandom } from '~/utils/random'

const props = defineProps({
  label: {
    type: String,
    default: 'Seed'
  },
  initialSeed: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update:seed', 'random-generator'])

// Generate a default seed if none provided
const initialRandomSeed = Math.floor(Math.random() * 1000000).toString()
const seed = ref(props.initialSeed || initialRandomSeed)
const seededRnd = ref<SeededRandom>(createRandom(seed.value))

// Update the random generator when seed changes
watch(seed, (newSeed) => {
  seededRnd.value = createRandom(newSeed)
  emit('update:seed', newSeed)
  emit('random-generator', seededRnd.value)
})

// Emit the initial random generator on mount
onMounted(() => {
  emit('update:seed', seed.value)
  emit('random-generator', seededRnd.value)
})

// Generate a new random seed
const generateNewSeed = () => {
  seed.value = Math.floor(Math.random() * 1000000).toString()
}

// Define what to expose to parent components
defineExpose({
  seed,
  seededRnd,
  generateNewSeed
})
</script>
