<template>
  <div>
    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Next 5 Days</h3>
    
    <div v-if="loading" class="text-center py-8">
      <ion-spinner name="crescent"></ion-spinner>
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 py-8">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="dailyData.length > 0" class="space-y-3">
      <div
        v-for="day in dailyData"
        :key="day.date"
        class="grid grid-cols-3 gap-4 p-4 bg-blue-50 dark:bg-gray-500 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-100 dark:hover:bg-gray-400 transition-all border border-blue-100 dark:border-gray-400"
      >
        <!-- Column 1: Day Name -->
        <div class="flex items-center justify-center">
          <p class="text-lg font-semibold text-gray-800 dark:text-white text-center">
            {{ day.dayName }}
          </p>
        </div>
        
        <!-- Column 2: Icon + Description -->
        <div class="flex flex-col items-center justify-center gap-1">
          <img :src="day.iconUrl" :alt="day.description" class="w-12 h-12" />
          <p class="text-xs text-gray-600 dark:text-gray-300 capitalize text-center">
            {{ day.description }}
          </p>
        </div>
        
        <!-- Column 3: Temperatures -->
        <div class="flex items-center justify-center gap-4">
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Max</p>
            <p class="text-xl font-bold text-red-500">{{ day.maxTemp }}°</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">Min</p>
            <p class="text-xl font-bold text-blue-500">{{ day.minTemp }}°</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
      No daily forecast available
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

const dailyData = ref([]);
const loading = ref(false);
const error = ref(null);


const getDayName = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const fetchDailyData = async () => {
  if (!props.city) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const forecast = await getWeatherForecast(props.city.lat, props.city.lon);
    
    // Group forecast by day and calculate min/max
    const dailyMap = {};
    const today = new Date().toDateString();
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      // Skip current day
      if (dateKey === today) return;
      
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          timestamp: item.dt,
          temps: [],
          weatherConditions: []
        };
      }
      
      dailyMap[dateKey].temps.push(item.main.temp);
      dailyMap[dateKey].weatherConditions.push(item.weather[0]);
    });
    
    // Convert to array and get next 5 days (excluding today)
    const days = Object.values(dailyMap).slice(0, 5);
    
    dailyData.value = days.map(day => {
      const dayName = getDayName(day.timestamp);
      
      // Find most frequent weather condition with time weighting
      const weatherFrequency = {};
      
      day.weatherConditions.forEach((weather, index) => {
        const key = weather.main;
        
        // Calculate the hour for this forecast entry
        // Each entry is typically 3 hours apart in the forecast
        const forecastTime = new Date(day.timestamp * 1000);
        const hourOffset = index * 3; // Assuming 3-hour intervals
        forecastTime.setHours(forecastTime.getHours() + hourOffset);
        const hour = forecastTime.getHours();
        
        // Weight daytime hours (8am-8pm) more heavily
        // Daytime gets weight of 2, nighttime gets weight of 1
        const weight = (hour >= 8 && hour < 20) ? 2 : 1;
        
        weatherFrequency[key] = (weatherFrequency[key] || 0) + weight;
      });
      
      // Get the weather type with highest weighted frequency
      const mostFrequentWeatherType = Object.keys(weatherFrequency).reduce((a, b) => 
        weatherFrequency[a] > weatherFrequency[b] ? a : b
      );
      
      // Find the first occurrence of the most frequent weather type
      const mostFrequentWeather = day.weatherConditions.find(w => w.main === mostFrequentWeatherType);
      
      // Convert night icon to day icon (replace 'n' with 'd')
      const dayIcon = mostFrequentWeather.icon.replace('n', 'd');
      
      return {
        date: day.timestamp,
        dayName: dayName,
        maxTemp: Math.round(Math.max(...day.temps)),
        minTemp: Math.round(Math.min(...day.temps)),
        description: mostFrequentWeather.description,
        iconUrl: getWeatherIconUrl(dayIcon)
      };
    });
  } catch (err) {
    error.value = 'Failed to load daily forecast';
    console.error('Daily forecast error:', err);
  } finally {
    loading.value = false;
  }
};

watch(() => props.city, fetchDailyData, { immediate: true });
</script>

