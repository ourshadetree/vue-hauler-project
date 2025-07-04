<!-- src/components/Modal.vue -->
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-button" @click="close">×</button>

      <!-- Named header slot -->
      <header v-if="$slots.header" class="modal-header">
        <slot name="header" />
      </header>

      <!-- Body: prefer named “body” slot, fallback to default slot -->
      <section class="modal-body">
        <slot name="body">
          <slot />
        </slot>
      </section>

      <!-- Named footer slot -->
      <footer v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </footer>
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
  padding: 1.5rem;
  border-radius: 8px;
  position: relative;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-family: 'Karla', sans-serif;
}

.close-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}

.modal-header {
  border-bottom: 1px solid #E5E7EB;
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
  font-family: 'Sora', sans-serif;
  font-size: 1.25rem;
  color: #0C2442;
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.modal-footer {
  border-top: 1px solid #E5E7EB;
  padding-top: 0.75rem;
  text-align: right;
}
</style>
