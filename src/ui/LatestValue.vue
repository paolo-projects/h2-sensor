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
  <v-btn @click="$emit('save')">Save</v-btn>
</template>
<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: false,
  },
});

const emits = defineEmits(["save"]);
</script>
