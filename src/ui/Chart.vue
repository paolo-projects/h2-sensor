<template>
  <div class="chart-container">
    <canvas ref="chart-canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, shallowRef, useTemplateRef, watch } from "vue";
import Chart from "chart.js/auto";

const chartRef = useTemplateRef("chart-canvas");

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const chart = shallowRef(null);

onMounted(() => {
  chart.value = new Chart(chartRef.value, {
    type: "line",
    data: {
      labels: props.data.labels,
      datasets: [
        {
          label: "ADC Value",
          data: props.data.values,
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
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "y",
          },
          zoom: {
            mode: "y",
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
          },
        },
      },
    },
  });
});

watch(
  () => props.data,
  (newData) => {
    if (chart.value) {
      chart.value.data.labels = newData.labels;
      chart.value.data.datasets[0].data = newData.values;
      chart.value.update();
    }
  }
);
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
</style>
