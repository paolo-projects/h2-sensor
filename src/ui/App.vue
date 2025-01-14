<template>
  <v-theme-provider class="pa-10" theme="dark" with-background>
    <SerialSelector @sensorData="onData" />
    <LatestValue
      :value="latestReading"
      @save="handleSave"
      style="margin: 1em 0"
    />
    <v-divider style="margin: 1em 0" />
    <v-tabs v-model="currentTab">
      <v-tab>Chart</v-tab>
      <v-tab>Table</v-tab>
    </v-tabs>
    <v-tabs-window v-model="currentTab" style="padding: 1em">
      <v-tabs-window-item :value="0">
        <Chart :data="sensorData" />
      </v-tabs-window-item>
      <v-tabs-window-item :value="1">
        <ValuesTable :items="sensorDataTabular" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-theme-provider>
</template>

<script setup>
import { ref, shallowRef, computed } from "vue";
import SerialSelector from "./SerialSelector.vue";
import Chart from "./Chart.vue";
import LatestValue from "./LatestValue.vue";
import ValuesTable from "./ValuesTable.vue";

const currentTab = ref(0);
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

  sensorData.value.labels.push(time);
  sensorData.value.values.push(data);

  sensorData.value = {
    labels: sensorData.value.labels,
    values: sensorData.value.values,
  };
  sensorDataTabular.value.push({ time, value: data });
  latestReading.value = data;
};

const handleSave = async () => {
  await electronAPI.saveData(sensorData.value);
};
</script>
