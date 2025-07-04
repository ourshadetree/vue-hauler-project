<template>
    <div class="step-wrapper">
      <h3 class="step-title">Your Profile</h3>
  
      <dl class="summary-list">
        <template v-for="(label, fieldKey) in fields">
          <div
            class="summary-item"
            v-if="profile[fieldKey] !== undefined && profile[fieldKey] !== null && profile[fieldKey] !== ''"
            :key="fieldKey"
          >
            <dt>{{ label }}</dt>
            <!-- if not editing, show read-only; else allow editing -->
            <dd v-if="!editing">{{ profile[fieldKey] }}</dd>
            <dd v-else>
              <input
                class="edit-input"
                v-model="profile[fieldKey]"
                :disabled="false"
              />
            </dd>
          </div>
        </template>
      </dl>

  
      <div class="action-bar">
          <button
            v-if="!editing"
            class="primary-btn"
            @click="$emit('edit')"
          >
            Edit Info
          </button>

          <template v-else>
            <button
              class="primary-btn"
              @click="$emit('save')"
            >
              Save
            </button>
            <button
              class="secondary-btn"
              @click="$emit('cancel')"
            >
              Cancel
            </button>
          </template>
      </div>
    </div>
  </template>
  
  <script setup>
  // bring in the new “editing” mode:
    const props = defineProps({
      profile:  { type: Object, required: true },
      editing:  { type: Boolean, default: false }
    })
    const emit = defineEmits(['edit','save','cancel'])
  
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

  .edit-input {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
/* and maybe style your secondary (Cancel) button: */
.secondary-btn {
  margin-left: 0.5rem;
  background: #ccc;
  color: #333;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.secondary-btn:hover {
  background: #bbb;
}
  </style>
  