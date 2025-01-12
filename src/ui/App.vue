<template>
  <SerialSelector @sensorData="onData" />
  <v-divider style="margin: 1em 0" />
  <Chart :data="sensorData" />
  <LatestValue :value="latestReading" />
</template>

<script setup>
import { ref, shallowRef } from "vue";
import SerialSelector from "./SerialSelector.vue";
import Chart from "./Chart.vue";
import LatestValue from "./LatestValue.vue";

const sensorData = shallowRef([]);
const latestReading = ref(null);

const onData = (data) => {
  sensorData.value = [].concat(sensorData.value, data);
  latestReading.value = data;
};
</script>
