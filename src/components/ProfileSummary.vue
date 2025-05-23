<template>
    <div class="step-wrapper">
      <h3 class="step-title">Your Profile</h3>
  
      <dl class="summary-list">
        <div
          class="summary-item"
          v-for="(label, key) in fields"
          :key="key"
          v-if="profile[key] !== undefined && profile[key] !== null && profile[key] !== ''"
        >
          <dt>{{ label }}</dt>
          <dd>{{ profile[key] }}</dd>
        </div>
      </dl>
  
      <div class="action-bar">
        <button class="primary-btn" @click="$emit('edit')">Edit Info</button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    profile: {
      type: Object,
      required: true
    }
  })
  const emit = defineEmits(['edit'])
  
  // map your profile keys to human‑friendly labels
  const fields = {
    first_name:            'First Name',
    last_name:             'Last Name',
    email_address:         'Email Address',
    company_name:          'Company Name',
    ein_number:            'EIN Number',
    business_phone:        'Business Phone',
    annual_revenue:        'Annual Revenue',
    net_income:            'Net Income',
    owner_name:            'Owner Name',
    owner_ssn_last4:       'SSN (last 4)',
    address_line1:         'Address',
    address_line2:         'Address (Line 2)',
    city:                  'City',
    state:                 'State',
    zip:                   'ZIP Code',
    cardholder_name:       'Cardholder Name',
    card_number:           'Card Number',
    expiry_date:           'Expiry Date',
    shipping_option:       'Shipping Option',
    tos_agree:             'Agreed to Terms'
  }
  </script>
  
  <style scoped>
  .step-wrapper {
    background: #fff;
    max-width: 700px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .step-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #0c2442;
    margin-bottom: 1.5rem;
  }
  
  .summary-list {
    display: grid;
    grid-template-columns: 1fr 2fr;
    row-gap: 1rem;
    column-gap: 2rem;
    margin-bottom: 2rem;
  }
  .summary-item dt {
    font-weight: 500;
    color: #333;
  }
  .summary-item dd {
    margin: 0;
    color: #555;
  }
  
  .action-bar {
    text-align: right;
  }
  .primary-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    background: #0c2442;
    color: #fff;
  }
  .primary-btn:hover {
    background: #092038;
  }
  </style>
  