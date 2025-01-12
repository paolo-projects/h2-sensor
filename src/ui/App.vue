<template>
  <SerialSelector @sensorData="onData" />
  <v-divider style="margin: 1em 0" />
  <Chart :data="sensorData" />
  <LatestValue :value="latestReading" @save="handleSave" />
  <ValuesTable :items="sensorDataTabular" />
</template>

<script setup>
import { ref, shallowRef, computed } from "vue";
import SerialSelector from "./SerialSelector.vue";
import Chart from "./Chart.vue";
import LatestValue from "./LatestValue.vue";
import ValuesTable from "./ValuesTable.vue";

const sensorData = shallowRef({
  labels: [],
  values: [],
});
const sensorDataTabular = ref([]);
const latestReading = ref(null);
const initialTime = ref(null);

const onData = (data) => {
  const nowTime = Date.now();

  if (sensorData.value.labels.length == 0) {
    initialTime.value = nowTime;
  }
  const time = (nowTime - initialTime.value) / 1000;
  sensorData.value = {
    labels: [...sensorData.value.labels, time],
    values: [...sensorData.value.values, data],
  };
  sensorDataTabular.value.push({ time, value: data });
  latestReading.value = data;
};

const handleSave = async () => {
  await electronAPI.saveData(sensorData.value);
};
</script>
