<template>
  <div>
    <div class="latest-value">
      <p>
        Reading:
        <v-text-field
          type="text"
          variant="outlined"
          readonly
          :value="props.value"
        />
      </p>
    </div>
    <v-btn @click="$emit('save')">Save data</v-btn>
  </div>
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
