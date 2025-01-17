<template>
  <v-select
    label="Device"
    :items="Object.keys(devices)"
    v-model="selectedDevice"
    variant="outlined"
  ></v-select>
  <v-btn
    @click="getDevices"
    :disabled="isOngoing"
    variant="flat"
    color="warning"
    class="mr-1"
    >Refresh</v-btn
  >
  <v-btn
    @click="isOngoing ? stopSerial() : startSerial()"
    variant="flat"
    color="primary"
    class="mr-1"
  >
    {{ isOngoing ? "Stop" : "Start" }}
  </v-btn>
  <v-btn variant="flat" color="error" @click="isClearDialogActive = true"
    >Clear</v-btn
  >
  <v-dialog v-model="isClearDialogActive" width="auto">
    <v-card
      max-width="400"
      prepend-icon="mdi-update"
      text="Are you sure you want to clear the data?"
      title="Clear"
    >
      <template v-slot:actions>
        <v-btn
          class="ml-auto"
          text="Cancel"
          @click="isClearDialogActive = false"
        ></v-btn>
        <v-btn
          text="Clear"
          color="error"
          @click="
            $emit('clearData');
            isClearDialogActive = false;
          "
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, shallowRef } from "vue";
import SerialPortLineReader from "../serial/line-reader";

const emits = defineEmits(["sensorData", "clearData"]);

const devices = ref({});
const selectedDevice = ref(null);
const reader = shallowRef(null);
const lineReader = shallowRef(new SerialPortLineReader());
const isOngoing = ref(false);
const isClearDialogActive = ref(false);

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
    if (line.indexOf("U12:") === -1) {
      return;
    }
    const u12 = Number(line.substring(line.indexOf("U12:") + 4));
    emits("sensorData", u12);
  });

  getDevices();
});
</script>
