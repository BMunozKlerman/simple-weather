<template>
  <div class="pb-6 border-b-2 border-gray-200 dark:border-gray-600">
    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Next Hours</h3>
    
    <div v-if="loading" class="text-center py-8">
      <ion-spinner name="crescent"></ion-spinner>
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 py-8">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="hourlyData.length > 0" class="flex gap-4 overflow-x-auto pb-2">
      <div
        v-for="hour in hourlyData"
        :key="hour.time"
        class="flex flex-col items-center min-w-[80px] p-3 bg-blue-50 dark:bg-gray-500 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-blue-100 dark:border-gray-400"
      >
        <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ hour.time }}</p>
        <img :src="hour.iconUrl" :alt="hour.description" class="w-16 h-16 my-2" />
        <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ hour.temp }}°</p>
        <p class="text-xs text-gray-600 dark:text-gray-300 mt-1">{{ hour.description }}</p>
      </div>
    </div>
    
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
      No hourly data available
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { IonSpinner } from '@ionic/vue';
import { getWeatherForecast, getWeatherIconUrl } from '../services/weatherService';

const props = defineProps({
  city: {
    type: Object,
    required: true
  }
});

const hourlyData = ref([]);
const loading = ref(false);
const error = ref(null);


const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const fetchHourlyData = async () => {
  if (!props.city) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const forecast = await getWeatherForecast(props.city.lat, props.city.lon);
    
    // Get next 8 hours (3-hour intervals from API)
    hourlyData.value = forecast.list.slice(0, 8).map(item => ({
      time: formatTime(item.dt),
      temp: Math.round(item.main.temp),
      description: item.weather[0].description,
      iconUrl: getWeatherIconUrl(item.weather[0].icon)
    }));
  } catch (err) {
    error.value = 'Failed to load hourly forecast';
    console.error('Hourly forecast error:', err);
  } finally {
    loading.value = false;
  }
};

watch(() => props.city, fetchHourlyData, { immediate: true });
</script>

