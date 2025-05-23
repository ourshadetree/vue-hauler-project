<template>
    <div class="step-wrapper">
      <h3 class="step-title">Review Other Owners</h3>
  
      <ul v-if="props.profile.other_owners?.length" class="owners-list">
        <li v-for="(o, i) in props.profile.other_owners" :key="i">
          {{ o.name }} — {{ o.percent_share }}%
        </li>
      </ul>
      <p v-else>No other owners added.</p>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ profile: Object })
  defineEmits(['valid'])
  
  // always valid (read‐only step)
  emit('valid', true)
  </script>
  
  <style scoped>
  .step-wrapper { background:#fff; max-width:700px; margin:2rem auto; padding:2rem; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1) }
  .step-title { font-size:1.75rem; font-weight:600; color:#0c2442; margin-bottom:1.5rem }
  .owners-list { list-style:disc inside; color:#333 }
  </style>
  