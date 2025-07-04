<template>
    <div class="invite-form">
      <div v-if="isLoading" class="loading">Loading invitation…</div>
      <div v-else>
        <h2 class="invite-title">You’re Invited!</h2>
        <p class="invite-banner">
          You’ve been invited by a friend to join HaulerFuel and unlock exclusive fuel discounts! Complete your details below to get started.
        </p>
        <div v-if="errorMessage" class="form-error">{{ errorMessage }}</div>
        <form @submit.prevent="() => emit('submit')">
          <!-- Company & Contact Info -->
          <div class="field">
            <label for="company_name">Company Name</label>
            <input id="company_name" v-model="profile.company_name" type="text" />
          </div>
          <div class="field-group">
            <div class="field half">
              <label for="first_name">First Name</label>
              <input id="first_name" v-model="profile.first_name" type="text" />
            </div>
            <div class="field half">
              <label for="last_name">Last Name</label>
              <input id="last_name" v-model="profile.last_name" type="text" />
            </div>
          </div>
          <div class="field">
            <label for="cell_number">Cell Number</label>
            <input id="cell_number" v-model="profile.cell_number" type="tel" />
          </div>
          <div class="field">
            <label for="email_address">Email Address</label>
            <input id="email_address" v-model="profile.email_address" type="email" />
          </div>
          <!-- Fleet Details -->
          <div class="field">
            <label for="dot_number">DOT Number</label>
            <input id="dot_number" v-model="profile.dot_number" type="text" />
          </div>
          <div class="field">
            <label for="number_of_trucks">Number of Trucks</label>
            <input id="number_of_trucks" v-model.number="profile.number_of_trucks" type="number" />
          </div>
          <!-- Mailing Address -->
          <div class="field">
            <label for="address_line1">Street Address</label>
            <input id="address_line1" v-model="profile.address_line1" type="text" />
          </div>
          <div class="field">
            <label for="address_line2">Address Line 2</label>
            <input id="address_line2" v-model="profile.address_line2" type="text" />
          </div>
          <div class="field-group">
            <div class="field third">
              <label for="city">City</label>
              <input id="city" v-model="profile.city" type="text" />
            </div>
            <div class="field third">
              <label for="state">State/Province</label>
              <input id="state" v-model="profile.state" type="text" />
            </div>
            <div class="field third">
              <label for="zip">Postal/Zip Code</label>
              <input id="zip" v-model="profile.zip" type="text" />
            </div>
          </div>
          <!-- Services of Interest -->
          <h3 class="services-title">Services of Interest</h3>
          <ul class="services-list">
            <li v-for="option in serviceOptions" :key="option.value">
              <label>
                <input
                  type="checkbox"
                  v-model="profile.services"
                  :value="option.value"
                />
                {{ option.label }}
              </label>
            </li>
          </ul>
          <!-- Action Buttons -->
          <div class="action-bar">
            <button type="submit" class="btn finish-btn" :disabled="!canSubmit">
              Finish Registration
            </button>
            <button
              type="button"
              class="btn secondary-btn"
              @click="() => emit('sign-in')"
            >
              Already a user? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  const props = defineProps({
    profile:      { type: Object, required: true },
    isLoading:    { type: Boolean, default: false },
    errorMessage: { type: String, default: '' }
  })
  const emit = defineEmits(['submit','sign-in'])
  
  const serviceOptions = [
    { value: 'fuel_discounts',    label: 'Fuel Card & Discounts' },
    { value: 'factoring',         label: 'Factoring (1 - 1.75% Rate)' },
    { value: 'maintenance',       label: 'Maintenance & Roadside Assistance' },
    { value: 'insurance_captive', label: 'Insurance Captive (Coming Soon)' },
    { value: 'load_matching',     label: 'Direct Shipper Load Matching (Coming Soon)' }
  ]
  
  const canSubmit = computed(() => {
    const p = props.profile
    return [
      p.company_name, p.first_name, p.last_name,
      p.cell_number, p.email_address, p.dot_number,
      p.number_of_trucks > 0, p.address_line1,
      p.city, p.state, p.zip,
      Array.isArray(p.services) && p.services.length
    ].every(val => !!String(val).trim())
  })
  </script>
  
  <style scoped>
  .invite-form {
    max-width: 700px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .loading {
    text-align: center;
    font-size: 1.25rem;
    color: #0C2442;
  }
  .invite-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.75rem;
    color: #0C2442;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .invite-banner {
    background: #ebf4ff;
    border-left: 4px solid #0C2442;
    padding: 0.75rem 1rem;
    color: #1a365d;
    margin-bottom: 1.5rem;
    font-family: 'Karla', sans-serif;
  }
  .form-error {
    background: #fed7d7;
    color: #9b2c2c;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
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
    padding: 0.6rem 0.8rem;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    font-size: 0.95rem;
  }
  .field input:focus {
    outline: none;
    border-color: #0C2442;
    box-shadow: 0 0 0 2px rgba(12,36,66,0.2);
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
  }
  .services-list li {
    margin-bottom: 0.5rem;
  }
  .services-list input {
    margin-right: 0.5rem;
  }
  .action-bar {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s, transform 0.1s;
  }
  .finish-btn {
    background: #B11818;
    color: #fff;
  }
  .finish-btn:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
  .finish-btn:hover:not(:disabled) {
    background: #8f1212;
  }
  .secondary-btn {
    background: #e2e8f0;
    color: #2d3748;
  }
  .secondary-btn:hover {
    background: #cbd5e0;
  }
  </style>
  