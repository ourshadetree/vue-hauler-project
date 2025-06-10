<template>
  <div class="step-wrapper">
    <h3 class="step-title">Card Details</h3>

    <div class="field">
      <label for="cardholder_name">Cardholder Name</label>
      <input
        id="cardholder_name"
        v-model="props.profile.cardholder_name"
        type="text"
      />
    </div>

    <div class="field">
      <label for="card_number">Card Number</label>
      <input
        id="card_number"
        v-model="props.profile.card_number"
        type="text"
        maxlength="19"
      />
    </div>

    <div class="field">
      <label for="expiry_date">Expiry Date</label>
      <input
        id="expiry_date"
        v-model="props.profile.expiry_date"
        type="month"
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

// Whenever any of these fields changes, validate and emit “valid”
watch(
  () => [
    props.profile.cardholder_name,
    props.profile.card_number,
    props.profile.expiry_date
  ],
  ([cardholder_name, card_number, expiry_date]) => {
    const valid =
      String(cardholder_name || '').trim().length > 0 &&
      String(card_number     || '').trim().length > 0 &&
      String(expiry_date     || '').trim().length > 0

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
