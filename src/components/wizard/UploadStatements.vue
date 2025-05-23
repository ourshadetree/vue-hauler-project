<template>
    <div class="step-wrapper">
      <h3 class="step-title">Upload Financial Statements</h3>
  
      <div class="field">
        <label for="statements">Select PDF or CSV</label>
        <input
          id="statements"
          class="upload-input"
          type="file"
          accept=".pdf,.csv"
          @change="onFileChange"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({ profile: Object })
  const emit  = defineEmits(['update:profile','valid'])
  
  const fileRef = ref(null)
  
  function onFileChange(e) {
    fileRef.value = e.target.files[0] || null
    emit('update:profile', { ...props.profile, statement_file: fileRef.value })
    emit('valid', !!fileRef.value)
  }
  
  // initialize as valid if already uploaded
  watch(fileRef, () => emit('valid', !!fileRef.value), { immediate: true })
  </script>
  
  <style scoped>
  .step-wrapper { background:#fff; max-width:700px; margin:2rem auto; padding:2rem; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1) }
  .step-title { font-size:1.75rem; font-weight:600; color:#0c2442; margin-bottom:1.5rem }
  .upload-input { display:block; width:100%; padding:0.5rem; border:1px dashed #aaa; border-radius:4px; cursor:pointer }
  </style>
  