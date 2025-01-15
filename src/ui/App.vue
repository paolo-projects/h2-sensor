<template>
  <v-theme-provider class="pa-10" theme="dark" with-background>
    <v-card>
      <v-card-text>
        <SerialSelector @sensorData="onData" @clearData="onClearData" />
        <LatestValue :value="latestReading" style="margin: 1em 0" />
        <v-btn @click="handleSave" variant="outlined" color="primary"
          >Export data</v-btn
        >
      </v-card-text>
    </v-card>
    <v-card style="margin: 1em 0 0 0">
      <v-card-text>
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
      </v-card-text>
    </v-card>
  </v-theme-provider>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import SerialSelector from "./SerialSelector.vue";
import Chart from "./Chart.vue";
import LatestValue from "./LatestValue.vue";
import ValuesTable from "./ValuesTable.vue";

const currentTab = ref(0);
const sensorData = shallowRef([]);
const sensorDataTabular = ref([]);
const latestReading = ref(null);
const initialTime = ref(null);

const onClearData = () => {
  sensorData.value = [];
  sensorDataTabular.value = [];
  latestReading.value = null;
};

const onData = (data) => {
  const nowTime = Date.now();

  if (sensorData.value.length == 0) {
    initialTime.value = nowTime;
  }
  const time = (nowTime - initialTime.value) / 1000;

  sensorData.value = sensorData.value.concat({ x: time, y: data });
  sensorDataTabular.value.push({ time, value: data });
  latestReading.value = data;
};

const handleSave = async () => {
  await electronAPI.saveData(
    sensorDataTabular.value.map((d) => ({
      time: d.time,
      value: d.value,
    }))
  );
};
</script>
