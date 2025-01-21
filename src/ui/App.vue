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
        </v-tabs>
        <v-tabs-window v-model="currentTab" style="padding: 1em">
          <v-tabs-window-item :value="0">
            <Chart ref="chart-component" />
          </v-tabs-window-item>
        </v-tabs-window>
        <v-btn @click="handleSave" variant="outlined" color="primary"
          >Export data</v-btn
        >
        <v-btn
          @click="handleTable"
          variant="outlined"
          color="warning"
          class="ml-1"
          >Tabular data</v-btn
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
const latestReading = ref(null);
const initialTime = ref(null);

const chartComponent = useTemplateRef("chart-component");

const onClearData = () => {
  chartComponent.value.clearData();
  latestReading.value = null;
};

const onData = (data) => {
  const nowTime = Date.now();

  if (chartComponent.value.getDataLength() == 0) {
    initialTime.value = nowTime;
  }
  const time = (nowTime - initialTime.value) / 1000;

  chartComponent.value.pushData({ x: time, y: data });
  latestReading.value = data;
};

const handleSave = async () => {
  await electronAPI.saveData(
    chartComponent.value.getData().map((d) => ({
      time: d.x,
      value: d.y,
    }))
  );
};

const handleTable = async () => {
  const tableData = chartComponent.value.getData().map((d) => ({
    time: d.x,
    value: d.y,
  }));
  await electronAPI.openTable(tableData);
};
</script>
