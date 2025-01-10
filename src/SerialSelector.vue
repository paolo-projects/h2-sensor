<template>
  <select v-model="selectedDevice">
    <option
      v-for="device in devicesList"
      :key="device.path"
      :value="device.path"
    >
      {{ device.path }}
    </option>
  </select>
  <button @click="getDevices">Refresh</button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const devicesList = ref([]);

const getDevices = async () => {
  const devices = await navigator.serial.getPorts();
  if (devices) {
    devicesList.value = devices;
  } else {
    console.error("No devices found", devices);
  }
};

onMounted(() => {
  getDevices();
});
</script>
