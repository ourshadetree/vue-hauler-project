<template>
  <div class="step-wrapper">
    <h3 class="step-title">Business Information</h3>

    <div class="field">
      <label for="company_name">Company Name</label>
      <input
        id="company_name"
        v-model="props.profile.company_name"
        type="text"
        placeholder="Enter your company name"
      />
    </div>

    <div class="field">
      <label for="ein_number">EIN Number</label>
      <input
        id="ein_number"
        v-model="props.profile.ein_number"
        type="text"
        placeholder="Enter your EIN"
      />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['valid'])

// Whenever either field changes, validate and emit “valid”
watch(
  () => [props.profile.company_name, props.profile.ein_number],
  ([company_name, ein_number]) => {
    const valid =
      String(company_name || '').trim().length > 0 &&
      String(ein_number   || '').trim().length > 0
    emit('valid', valid)
  },
  { immediate: true }
)
</script>

<style scoped>
.step-wrapper {
  background: #fff;
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.step-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #0c2442;
  margin-bottom: 1.5rem;
}
.field {
  margin-bottom: 1.5rem;
}
.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}
.field input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
