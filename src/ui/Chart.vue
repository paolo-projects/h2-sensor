<template>
  <div class="main-container">
    <div class="chart-container">
      <canvas ref="chart-canvas"></canvas>
    </div>
    <v-btn
      class="reset-button"
      density="compact"
      icon="mdi-restore"
      v-show="isZoomed"
      @click="restoreZoomPan"
    ></v-btn>
  </div>
</template>

<script setup>
import { onMounted, shallowRef, useTemplateRef, ref } from "vue";
import Chart from "chart.js/auto";

const chartRef = useTemplateRef("chart-canvas");

const chart = shallowRef(null);
const isZoomed = ref(false);

onMounted(() => {
  chart.value = new Chart(chartRef.value, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "ADC Value",
          data: [],
          borderWidth: 1,
          fill: false,
          borderColor: "#999999",
          backgroundColor: "#666666",
        },
      ],
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      showLine: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        zoom: {
          limits: {
            y: { min: 0, max: Math.pow(2, 12) },
          },
          pan: {
            enabled: true,
            mode: "xy",
            modifierKey: "ctrl",
            onPan() {
              isZoomed.value = true;
            },
          },
          zoom: {
            mode: "xy",
            wheel: {
              enabled: true,
            },
            drag: {
              enabled: true,
            },
            onZoom() {
              isZoomed.value = true;
            },
          },
        },
      },
    },
  });
});

const setData = (data) => {
  if (chart.value) {
    chart.value.data.datasets[0].data = data;
    chart.value.update();
  }
};

const getData = () => {
  return chart.value ? chart.value.data.datasets[0].data : [];
};

const getDataLength = () => {
  return chart.value ? chart.value.data.datasets[0].data.length : 0;
};

const pushData = (...data) => {
  if (chart.value) {
    chart.value.data.datasets[0].data.push(...data);
    chart.value.update();
  }
};

const clearData = () => {
  if (chart.value) {
    chart.value.data.datasets[0].data = [];
    chart.value.update();
  }
};

const restoreZoomPan = () => {
  chart.value.resetZoom();
  isZoomed.value = false;
};

defineExpose({
  setData,
  getData,
  getDataLength,
  pushData,
  clearData,
  restoreZoomPan,
});
</script>
<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 450px;
}
.chart-canvas {
  width: 100%;
  height: 100%;
}
.main-container {
  position: relative;
}
.reset-button {
  position: absolute;
  top: 0;
  right: 0;
  transition: opacity 0.3s linear, visibility 0.3s linear;
}
</style>
