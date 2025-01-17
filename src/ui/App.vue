<template>
  <v-theme-provider theme="dark" with-background>
    <v-card>
      <v-card-text>
        <SerialSelector @sensorData="onData" @clearData="onClearData" />
        <LatestValue :value="latestReading" style="margin: 1em 0" />
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
            <Chart ref="chart-component" />
          </v-tabs-window-item>
          <v-tabs-window-item :value="1">
            <ValuesTable :items="sensorData" />
          </v-tabs-window-item>
        </v-tabs-window>
        <v-btn @click="handleSave" variant="outlined" color="primary"
          >Export data</v-btn
        >
      </v-card-text>
    </v-card>
  </v-theme-provider>
</template>

<script setup>
import { ref, shallowReactive, useTemplateRef } from "vue";
import SerialSelector from "./SerialSelector.vue";
import Chart from "./Chart.vue";
import LatestValue from "./LatestValue.vue";
import ValuesTable from "./ValuesTable.vue";

const currentTab = ref(0);
const sensorData = shallowReactive([]);
const latestReading = ref(null);
const initialTime = ref(null);

const chartComponent = useTemplateRef("chart-component");

const onClearData = () => {
  sensorData.splice(0, sensorData.length);
  chartComponent.value.clearData();
  latestReading.value = null;
};

const onData = (data) => {
  const nowTime = Date.now();

  if (sensorData.length == 0) {
    initialTime.value = nowTime;
  }
  const time = (nowTime - initialTime.value) / 1000;

  sensorData.push({ x: time, y: data });
  chartComponent.value.pushData({ x: time, y: data });
  latestReading.value = data;
};

const handleSave = async () => {
  await electronAPI.saveData(
    sensorData.map((d) => ({
      time: d.x,
      value: d.y,
    }))
  );
};
</script>
