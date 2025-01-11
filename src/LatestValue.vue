<template>
  <div class="latest-value">
    <p>Latest Value: <input type="text" readonly :value="props.value" /></p>
  </div>
</template>
<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: false,
  },
});
</script>
