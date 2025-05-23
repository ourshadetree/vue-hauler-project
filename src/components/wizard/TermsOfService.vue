<template>
    <div class="step-wrapper">
      <h3 class="step-title">Terms of Service</h3>
  
      <div class="tos-text">
        <!-- paste long TOS here, or slot it in -->
        <slot>…Your terms go here…</slot>
      </div>
  
      <div class="checkbox-option agree">
        <input
          type="checkbox"
          id="agree"
          v-model="local.agree"
        />
        <label for="agree">I have read and agree to the Terms of Service</label>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from 'vue'
  const props = defineProps({ profile: Object })
  const emit  = defineEmits(['update:profile','valid'])
  
  const local = reactive({
    agree: props.profile.tos_agree || false
  })
  
  watch(local, () => {
    emit('update:profile', { ...props.profile, tos_agree: local.agree })
    emit('valid', local.agree === true)
  }, { deep: true, immediate: true })
  </script>
  
  <style scoped>
  .step-wrapper { background:#fff; max-width:700px; margin:2rem auto; padding:2rem; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1) }
  .step-title { font-size:1.75rem; font-weight:600; color:#0c2442; margin-bottom:1rem }
  .tos-text { max-height:200px; overflow-y:auto; padding:1rem; border:1px solid #eee; border-radius:4px; margin-bottom:1.5rem; color:#444; }
  .checkbox-option { display:flex; align-items:center; cursor:pointer }
  .checkbox-option input { margin-right:0.75rem }
  </style>
  