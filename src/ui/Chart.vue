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
}
</style>
