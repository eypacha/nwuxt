<template>
  <div class="flex flex-col items-center justify-center flex-1 h-full p-6 text-center bg-sky-300">
    <canvas ref="plantCanvas" class="mb-4 outline outline-1" width="400" height="400"></canvas>
    <div class="flex flex-col mb-4 space-y-2">
      <SeedInput 
        @update:seed="updateSeed" 
        @random-generator="updateRandomGenerator" 
      />
      <PlantSelector
        @plant-selected="updatePlantSystem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PLANTS } from '../constants/plants';
import { usePlantSystem } from '../composables/usePlantSystem';

// Import the necessary type
import type { PlantDefinition } from '../types/plants.types';

// Canvas reference
const plantCanvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

// Use the plant system composable
const { 
  currentSeed, 
  iterations, 
  updateSeed, 
  updateRandomGenerator, 
  updatePlantSystem: updatePlant,
  generateNewPlant
} = usePlantSystem();

// Wrapper for updatePlantSystem to include canvas details
const updatePlantSystem = (plant: PlantDefinition): void => {
  if (!plant || !ctx || !plantCanvas.value) return;
  updatePlant(plant, ctx, plantCanvas.value.width, plantCanvas.value.height);
};

// Initialize the canvas once mounted
onMounted(() => {
  if (plantCanvas.value) {
    ctx = plantCanvas.value.getContext('2d');
    
    if (ctx && PLANTS.length > 0) {
      updatePlantSystem(PLANTS[0]);
    }
  } else {
    console.error('Canvas element not found');
  }
});
</script>