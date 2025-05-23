<template>
    <div class="step-wrapper">
      <h3 class="step-title">Business Finances</h3>
  
      <div class="field">
        <label for="annual_revenue">Annual Revenue</label>
        <input
          id="annual_revenue"
          v-model="local.annual_revenue"
          type="number"
          placeholder="e.g. 250000"
        />
      </div>
  
      <div class="field">
        <label for="net_income">Net Income</label>
        <input
          id="net_income"
          v-model="local.net_income"
          type="number"
          placeholder="e.g. 50000"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from 'vue'
  
  const props = defineProps({ profile: Object })
  const emit  = defineEmits(['update:profile','valid'])
  
  const local = reactive({
    annual_revenue: props.profile.annual_revenue || '',
    net_income:     props.profile.net_income     || ''
  })
  
  watch(local, () => {
    emit('update:profile', { ...props.profile, ...local })
    const valid = Object.values(local).every(v => String(v||'').trim().length > 0)
    emit('valid', valid)
  }, { deep: true, immediate: true })
  </script>
  
  <style scoped>
  /* same styling as BusinessInfo.vue */
  .step-wrapper { background:#fff; max-width:700px; margin:2rem auto; padding:2rem; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1) }
  .step-title { font-size:1.75rem; font-weight:600; color:#0c2442; margin-bottom:1.5rem }
  .field { margin-bottom:1.5rem }
  .field label { display:block; margin-bottom:0.5rem; font-weight:500; color:#333 }
  .field input { width:100%; padding:0.75rem; border:1px solid #ccc; border-radius:4px; font-size:1rem }
  </style>
  