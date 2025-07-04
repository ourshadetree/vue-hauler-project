<template>
  <div class="modal-content">
    <div class="form-container">
      <div v-if="props.isLoading" class="loading">Loading…</div>
      <div v-else>
        <h2 class="profile-title">Registration Form</h2>
        <form @submit.prevent="onSubmit">
          <!-- Company & Contact Info -->
          <div class="field">
            <label for="company_name">Company Name</label>
            <input id="company_name" v-model="props.profile.company_name" type="text" />
          </div>
          <div class="field-group">
            <div class="field half">
              <label for="first_name">First Name</label>
              <input id="first_name" v-model="props.profile.first_name" type="text" />
            </div>
            <div class="field half">
              <label for="last_name">Last Name</label>
              <input id="last_name" v-model="props.profile.last_name" type="text" />
            </div>
          </div>
          <div class="field">
            <label for="cell_number">Cell Number</label>
            <input id="cell_number" v-model="props.profile.cell_number" type="tel" />
          </div>
          <div class="field">
            <label for="email_address">Email Address</label>
            <input id="email_address" v-model="props.profile.email_address" type="email" />
          </div>

          <!-- Fleet Details -->
          <div class="field">
            <label for="dot_number">DOT Number</label>
            <input id="dot_number" v-model="props.profile.dot_number" type="text" />
          </div>
          <div class="field">
            <label for="number_of_trucks">Number of Trucks</label>
            <input
              id="number_of_trucks"
              v-model.number="props.profile.number_of_trucks"
              type="number"
              min="0"
            />
          </div>

          <!-- Mailing Address -->
          <div class="field">
            <label for="address_line1">Street Address</label>
            <input id="address_line1" v-model="props.profile.address_line1" type="text" />
          </div>
          <div class="field">
            <label for="address_line2">Address Line 2</label>
            <input id="address_line2" v-model="props.profile.address_line2" type="text" />
          </div>
          <div class="field-group">
            <div class="field third">
              <label for="city">City</label>
              <input id="city" v-model="props.profile.city" type="text" />
            </div>
            <div class="field third">
              <label for="state">State/Province</label>
              <input id="state" v-model="props.profile.state" type="text" />
            </div>
            <div class="field third">
              <label for="zip">Postal/Zip Code</label>
              <input id="zip" v-model="props.profile.zip" type="text" />
            </div>
          </div>

          <!-- Services of Interest -->
          <h3 class="services-title">Services of Interest</h3>
          <ul class="services-list">
            <li v-for="opt in serviceOptions" :key="opt.value">
              <label>
                <input
                  type="checkbox"
                  :checked="props.profile.services.includes(opt.value)"
                  @change="toggleService(opt.value)"
                />
                {{ opt.label }}
              </label>
            </li>
          </ul>

          <!-- Error Message -->
          <div v-if="props.errorMessage" class="modal-error">
            {{ props.errorMessage }}
          </div>

          <!-- Action Bar -->
          <div class="action-bar">
            <button type="button" class="btn secondary-btn" @click="onSignOut">
              Sign Out
            </button>
            <button type="submit" class="btn finish-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  profile:      { type: Object, required: true },
  isLoading:    Boolean,
  errorMessage: String,
})

const emit = defineEmits(['signOut', 'submit'])

const serviceOptions = [
  { value: 'fuel_discounts',    label: 'Fuel Card & Discounts' },
  { value: 'factoring',         label: 'Factoring (1 - 1.75% Rate)' },
  { value: 'maintenance',       label: 'Maintenance & Roadside Assistance' },
  { value: 'insurance_captive', label: 'Insurance Captive (Coming Soon)' },
  { value: 'load_matching',     label: 'Load Matching (Coming Soon)' },
]

// explicit toggle so they act independently
function toggleService(val) {
  const arr = props.profile.services
  const idx = arr.indexOf(val)
  if (idx > -1) {
    arr.splice(idx, 1)
  } else {
    arr.push(val)
  }
}

function onSubmit() {
  emit('submit')
}

function onSignOut() {
  emit('signOut')
}
</script>

<style scoped>
.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
}

.form-container {
  padding: 2rem 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
}

.loading {
  text-align: center;
  color: #0C2442;
  font-size: 1rem;
}

.profile-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.75rem;
  color: #0C2442;
  text-align: center;
  margin-bottom: 1.5rem;
}

.field,
.field-group,
.services-list {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-family: 'Karla', sans-serif;
  font-size: 0.9rem;
  color: #2d3748;
  margin-bottom: 0.3rem;
}

.field input {
  width: 100%;
  background: #fff;
  font-size: 0.95rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.field input:focus {
  outline: none;
  border-color: #0C2442;
  box-shadow: 0 0 0 2px rgba(12, 36, 66, 0.2);
}

.field-group {
  display: flex;
  gap: 1rem;
}

.field.half,
.field.third {
  flex: 1;
}

.services-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.25rem;
  color: #0C2442;
  margin-bottom: 0.5rem;
}

.services-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.services-list li {
  margin-bottom: 0.5rem;
}

.services-list input {
  margin-right: 0.5rem;
}

.modal-error {
  background: #fed7d7;
  color: #9b2c2c;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
}

.finish-btn {
  background: #B11818;
  color: #fff;
  border: none;
}

.finish-btn:hover {
  background: #8f1212;
}

.finish-btn:active {
  transform: scale(0.98);
}

.finish-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.secondary-btn {
  background: #e2e8f0;
  color: #2d3748;
  border: none;
}

.secondary-btn:hover {
  background: #cbd5e0;
}

.secondary-btn:active {
  transform: scale(0.98);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: #2d3748;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #0C2442;
}
</style>
