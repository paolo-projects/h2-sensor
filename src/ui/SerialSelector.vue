<template>
  <v-select
    label="Device"
    :items="Object.keys(devices)"
    v-model="selectedDevice"
    variant="outlined"
  ></v-select>
  <v-btn @click="getDevices" :disabled="isOngoing">Refresh</v-btn>
  <v-btn @click="isOngoing ? stopSerial() : startSerial()">
    {{ isOngoing ? "Stop" : "Start" }}
  </v-btn>
</template>

<script setup>
import { ref, onMounted, shallowRef } from "vue";
import SerialPortLineReader from "../serial/line-reader";

const emits = defineEmits(["sensorData"]);

const devices = ref({});
const selectedDevice = ref(null);
const reader = shallowRef(null);
const lineReader = shallowRef(new SerialPortLineReader());
const isOngoing = ref(false);

const getDevices = async () => {
  let dvcs = await navigator.serial.getPorts();
  if (dvcs) {
    dvcs = dvcs.filter((device) => device.getInfo().usbProductId);
    devices.value = dvcs.reduce((acc, device) => {
      acc[
        device.getInfo().usbProductId + " - " + device.getInfo().usbVendorId
      ] = device;
      return acc;
    }, {});
  } else {
    console.error("No devices found", devices);
  }
};

const stopSerial = async () => {
  isOngoing.value = false;

  if (selectedDevice.value != null) {
    const device = devices.value[selectedDevice.value];
    await reader.value.releaseLock();
    await device.close();
  }
};

const startSerial = async () => {
  isOngoing.value = true;

  if (selectedDevice.value != null) {
    const device = devices.value[selectedDevice.value];
    await device.open({ baudRate: 9600 });

    while (device.readable) {
      reader.value = device.readable.getReader();

      lineReader.value.setReader(reader.value);
      lineReader.value.clearBuffer();

      try {
        await lineReader.value.read();
      } catch (error) {
        // TODO: Handle non-fatal read error.
        console.error(error);
      }
    }
  }

  isOngoing.value = false;
};

onMounted(() => {
  lineReader.value.addListener((line) => {
    const u12 = Number(line.substring(line.indexOf("U12:") + 4));
    emits("sensorData", u12);
  });

  getDevices();
});
</script>
