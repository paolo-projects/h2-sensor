<template>
  <div class="chart-container">
    <canvas ref="chart-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef, useTemplateRef, watch } from "vue";
import Chart from "chart.js/auto";

const chartRef = useTemplateRef("chart-canvas");

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const chart = shallowRef(null);

onMounted(() => {
  chart.value = new Chart(chartRef.value, {
    type: "line",
    data: {
      labels: props.data.map((_, index) => index),
      datasets: [
        {
          label: "ADC Value",
          data: props.data,
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      animation: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
});

watch(
  () => props.data,
  (newData) => {
    if (chart.value) {
      chart.value.data.labels = newData.map((_, index) => index);
      chart.value.data.datasets[0].data = newData;
      chart.value.update();
    }
  }
);
</script>
<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>
