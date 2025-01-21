<template>
  <v-theme-provider theme="dark" with-background>
    <v-card>
      <v-card-text>
        <ValuesTable :items="sensorData" />
      </v-card-text>
    </v-card>
  </v-theme-provider>
</template>

<script setup>
import { onMounted, ref, shallowReactive, useTemplateRef } from "vue";
import ValuesTable from "./ValuesTable.vue";

const sensorData = shallowReactive([]);

onMounted(async () => {
  const data = await electronAPI.fetchData();
  sensorData.splice(0, sensorData.length, ...data);
});

const handleSave = async () => {
  await electronAPI.saveData(
    sensorData.map((d) => ({
      time: d.x,
      value: d.y,
    }))
  );
};
</script>
