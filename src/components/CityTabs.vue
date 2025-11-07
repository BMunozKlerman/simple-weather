<template>
  <div class="w-full border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900">
    <div class="flex gap-1 items-center">
      <!-- Default cities -->
      <div
        v-for="city in cities"
        :key="city.name"
        @click="selectCity(city)"
        class="px-4 py-2 border-2 rounded-t-lg -mb-[2px] transition-all cursor-pointer"
        :class="[
          selectedCity?.name === city.name
            ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 border-b-white dark:border-b-gray-800 z-20'
            : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
        ]"
      >
        <span
          class="font-semibold whitespace-nowrap transition-all"
          :class="[
            selectedCity?.name === city.name
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300'
          ]"
        >
          {{ city.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const cities = ref([
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.90278, lon: -43.20750 },
  { name: 'Beijing', country: 'China', lat: 39.90750, lon: 116.39723 },
  { name: 'Los Angeles', country: 'United States', lat: 34.05223, lon: -118.24368 }
]);

const selectedCity = ref(null);

const selectCity = (city) => {
  selectedCity.value = city;
  emit('update:modelValue', city);
};

onMounted(() => {
  // Always select the first city by default on load
  if (cities.value.length > 0) {
    selectCity(cities.value[0]);
  }
});

// Watch for changes in modelValue to sync selected city
watch(() => props.modelValue, (newValue) => {
  selectedCity.value = newValue;
});
</script>

<style scoped>
/* Override Ionic button defaults to ensure our tab styling works */
button {
  --background: transparent;
  --background-activated: transparent;
  --background-focused: transparent;
  --background-hover: transparent;
  --box-shadow: none;
  --border-radius: 0;
  margin: 0;
  text-transform: none;
  letter-spacing: normal;
}
</style>
