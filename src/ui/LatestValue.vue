<template>
  <div class="latest-value">
    <p>
      Latest Value:
      <v-text-field
        type="text"
        variant="outlined"
        readonly
        :value="props.value"
      />
    </p>
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
