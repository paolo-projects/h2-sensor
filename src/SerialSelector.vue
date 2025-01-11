<template>
  <select v-model="selectedDevice" :disabled="isOngoing">
    <option
      v-for="(device, index) in devicesInfo"
      :key="device.usbProductId"
      :value="index"
    >
      0x{{ Number(device.usbVendorId).toString(16) }} - 0x{{
        Number(device.usbProductId).toString(16)
      }}
    </option>
  </select>
  <button @click="getDevices" :disabled="isOngoing">Refresh</button>
  <button @click="isOngoing ? stopSerial() : startSerial()">
    {{ isOngoing ? "Stop" : "Start" }}
  </button>
</template>

<script setup>
import { ref, onMounted, shallowRef } from "vue";
import SerialPortLineReader from "./serial/line-reader";

const emits = defineEmits(["sensorData"]);

const devicesList = ref([]);
const devicesInfo = ref([]);
const selectedDevice = ref(null);
const reader = shallowRef(null);
const lineReader = shallowRef(new SerialPortLineReader());
const isOngoing = ref(false);

const getDevices = async () => {
  const devices = await navigator.serial.getPorts();
  if (devices) {
    devicesList.value = devices.filter(
      (device) => device.getInfo().usbProductId
    );
    devicesInfo.value = devicesList.value.map((device) => device.getInfo());
  } else {
    console.error("No devices found", devices);
  }
};

const stopSerial = async () => {
  isOngoing.value = false;

  if (selectedDevice.value != null) {
    const device = devicesList.value[selectedDevice.value];
    await reader.value.releaseLock();
    await device.close();
  }
};

const startSerial = async () => {
  isOngoing.value = true;

  if (selectedDevice.value != null) {
    const device = devicesList.value[selectedDevice.value];
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
};

onMounted(() => {
  lineReader.value.addListener((line) => {
    const u12 = Number(line.substring(line.indexOf("U12:") + 4));
    emits("sensorData", u12);
  });

  getDevices();
});
</script>
