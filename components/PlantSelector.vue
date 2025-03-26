<template>
  <div class="plant-selector">
    <label for="plant-select" class="block text-sm font-medium text-gray-700">Seleccionar planta:</label>
    <select 
      id="plant-select" 
      v-model="selectedPlant"
      @change="emitSelectedPlant"
      class="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      <option v-for="(plant, index) in plants" :key="index" :value="index">
        {{ plant.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { PLANTS } from '../constants/plants';

const props = defineProps({
  plants: {
    type: Array,
    default: () => PLANTS
  }
});

const emit = defineEmits(['plant-selected']);
const selectedPlant = ref(0);

function emitSelectedPlant() {
  emit('plant-selected', props.plants[selectedPlant.value]);
}

// Emitir la planta seleccionada al montar el componente
watch(selectedPlant, emitSelectedPlant, { immediate: true });
</script>
