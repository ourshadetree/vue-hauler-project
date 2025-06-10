<template>
  <div class="step-wrapper">
    <h3 class="step-title">Primary Business Address</h3>

    <div class="field">
      <label for="address_line1">Address Line 1</label>
      <input
        id="address_line1"
        v-model="props.profile.address_line1"
        type="text"
      />
    </div>

    <div class="field">
      <label for="address_line2">Address Line 2</label>
      <input
        id="address_line2"
        v-model="props.profile.address_line2"
        type="text"
      />
    </div>

    <div class="field">
      <label for="city">City</label>
      <input id="city" v-model="props.profile.city" type="text" />
    </div>

    <div class="field">
      <label for="state">State</label>
      <input id="state" v-model="props.profile.state" type="text" />
    </div>

    <div class="field">
      <label for="zip">ZIP Code</label>
      <input id="zip" v-model="props.profile.zip" type="text" />
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

// Whenever any required address field changes, validate and emit “valid”
watch(
  () => [
    props.profile.address_line1,
    props.profile.city,
    props.profile.state,
    props.profile.zip
  ],
  ([address_line1, city, state, zip]) => {
    const valid =
      String(address_line1 || '').trim().length > 0 &&
      String(city             || '').trim().length > 0 &&
      String(state            || '').trim().length > 0 &&
      String(zip              || '').trim().length > 0
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
