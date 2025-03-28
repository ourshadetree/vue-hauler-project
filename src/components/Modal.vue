<!-- Modal.vue -->
<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <button class="close-button" @click="close">×</button>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Modal",
    methods: {
      close() {
        this.$emit("close");
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    position: relative;
    min-width: 300px;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
  </style>
  