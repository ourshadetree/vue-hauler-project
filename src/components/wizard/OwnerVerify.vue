<template>
  <div class="step-wrapper">
    <h3 class="step-title">Owner Verification</h3>

    <div class="field">
      <label for="owner_name">Owner Full Name</label>
      <input
        id="owner_name"
        v-model="props.profile.owner_name"
        type="text"
      />
    </div>

    <div class="field">
      <label for="owner_ssn_last4">SSN (last 4 digits)</label>
      <input
        id="owner_ssn_last4"
        v-model="props.profile.owner_ssn_last4"
        maxlength="4"
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

// Validate whenever owner_name or owner_ssn_last4 changes
watch(
  () => [props.profile.owner_name, props.profile.owner_ssn_last4],
  ([owner_name, owner_ssn_last4]) => {
    const valid =
      String(owner_name || '').trim().length > 0 &&
      String(owner_ssn_last4 || '').trim().length === 4
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
