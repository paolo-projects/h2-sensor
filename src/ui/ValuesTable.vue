<template>
  <div class="table-container">
    <v-data-table-virtual
      :headers="headers"
      :items="items"
      :sort-by="sortBy"
    ></v-data-table-virtual>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const headers = [
  { key: "time", title: "Time (s)", value: "time", sortable: true },
  { key: "value", title: "ADC Value", value: "value", sortable: true },
];

const sortBy = ref([{ key: "time", order: "desc" }]);
</script>
<style scoped>
.table-container {
  margin: 1em 0;
  height: 400px;
  overflow-y: scroll;
}
</style>
