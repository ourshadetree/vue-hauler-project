<template>
  <div class="step-wrapper">
    <h3 class="step-title">Card Shipment Info</h3>

    <p>We'll ship your cards to this address:</p>
    <p class="address">{{ props.profile.address_line1 }}, {{ props.profile.city }}</p>
    <a href="#" @click.prevent="$emit('edit-address')">Use a different address</a>

    <div class="checkbox-group">
      <div class="checkbox-option">
        <input
          type="radio"
          id="shipping_standard"
          value="standard"
          v-model="props.profile.shipping_option"
        />
        <label for="shipping_standard">Standard (5–7 business days)</label>
      </div>
      <div class="checkbox-option">
        <input
          type="radio"
          id="shipping_expedited"
          value="expedited"
          v-model="props.profile.shipping_option"
        />
        <label for="shipping_expedited">Expedited (2–3 business days)</label>
      </div>
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
const emit = defineEmits(['valid', 'edit-address'])

// Validate whenever shipping_option changes
watch(
  () => props.profile.shipping_option,
  (shipping_option) => {
    emit('valid', !!shipping_option)
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
  margin-bottom: 1rem;
}
.address {
  margin: 0.5rem 0;
  font-weight: 500;
}
a {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #646cff;
  text-decoration: underline;
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.checkbox-option {
  display: flex;
  align-items: center;
}
.checkbox-option input {
  margin-right: 0.5rem;
}
</style>
