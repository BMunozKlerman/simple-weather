<template>
  <ion-page>
    <!-- 1. Header with app name -->
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title class="ml-4 font-bold">Simple Weather</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-no-padding">
      <div class="flex flex-col w-full h-full">
        <!-- 2. City Tabs -->
        <div class="flex-shrink-0">
          <CityTabs 
            v-model="selectedCity"
          />
        </div>
        
        <!-- Tab Content Area -->
        <div class="flex-1 w-full bg-blue-50 dark:bg-gray-700 overflow-y-auto">
          <div class="p-6">
            <!-- 3. Hourly Forecast -->
            <HourlyForecast v-if="selectedCity" :city="selectedCity" />
            
            <!-- 4. Daily Forecast (Next 5 days) -->
            <DailyForecast v-if="selectedCity" :city="selectedCity" />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import CityTabs from '../components/CityTabs.vue';
import HourlyForecast from '../components/HourlyForecast.vue';
import DailyForecast from '../components/DailyForecast.vue';

const selectedCity = ref(null);
</script>
