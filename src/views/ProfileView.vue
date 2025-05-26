<template>
  <div class="profile-view">
    <!-- Global loader -->
    <div v-if="isLoading" class="loading">Loading…</div>

    <div v-else>
      <!-- Sign Out -->
      <button class="sign-out-btn" @click="signOut">Sign Out</button>

      <!-- Title -->
      <h2 class="profile-title">
        {{ profile.is_finished ? 'Your Profile' : steps[currentStep].title }}
      </h2>

      <!-- Wizard (if not finished) -->
      <component
        v-if="!profile.is_finished"
        :is="steps[currentStep].component"
        v-model:profile="profile"
        @valid="stepValid = $event"
      />

      <!-- Summary View (if finished) -->
      <div v-else class="profile-summary">
        <form @submit.prevent="saveChanges">
          <div class="field" v-for="key in editableFields" :key="key">
            <label :for="key">{{ fieldLabels[key] || key }}</label>
            <input
              :id="key"
              v-model="profile[key]"
              :readonly="!editing"
              :disabled="!editing"
              type="text"
            />
          </div>

          <div class="summary-actions">
            <button v-if="!editing" type="button" @click="editing = true">Edit Info</button>
            <button v-else type="submit">Save Changes</button>
          </div>
        </form>
      </div>

      <!-- Wizard navigation -->
      <div v-if="!profile.is_finished" class="wizard-nav">
        <button @click="prev" :disabled="currentStep === 0">Back</button>
        <button
          v-if="currentStep < steps.length - 1"
          @click="next"
          :disabled="!stepValid"
        >
          Next
        </button>
        <button
          v-else
          @click="finish"
          :disabled="!stepValid"
        >
          Submit Application
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/composables/useAuth'

import BusinessInfo           from '@/components/wizard/BusinessInfo.vue'
import BusinessFinances       from '@/components/wizard/BusinessFinances.vue'
import OwnerVerify            from '@/components/wizard/OwnerVerify.vue'
import PrimaryBusinessAddress from '@/components/wizard/PrimaryBusinessAddress.vue'
import CardDetails            from '@/components/wizard/CardDetails.vue'
import CardShipment           from '@/components/wizard/CardShipment.vue'
import TermsOfService         from '@/components/wizard/TermsOfService.vue'

const router = useRouter()
const { user, signOut, loading: authLoading } = auth

const isLoading = ref(true)
const currentStep = ref(0)
const stepValid = ref(false)
const editing = ref(false)

const profile = reactive({
  user_id: null,
  first_name: '',
  last_name: '',
  company_name: '',
  ein_number: '',
  business_phone: '',
  email_address: '',
  annual_revenue: '',
  net_income: '',
  owner_name: '',
  owner_ssn_last4: '',
  other_owners: [],
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  zip: '',
  cardholder_name: '',
  card_number: '',
  expiry_date: '',
  shipping_option: 'standard',
  tos_agree: false,
  is_finished: false
})

const editableFields = [
  'first_name', 'last_name', 'company_name', 'ein_number',
  'business_phone', 'email_address', 'annual_revenue', 'net_income',
  'owner_name', 'owner_ssn_last4', 'address_line1', 'address_line2',
  'city', 'state', 'zip', 'cardholder_name', 'card_number',
  'expiry_date', 'shipping_option'
]

const fieldLabels = {
  first_name: 'First Name',
  last_name: 'Last Name',
  company_name: 'Company Name',
  ein_number: 'EIN Number',
  business_phone: 'Business Phone',
  email_address: 'Email Address',
  annual_revenue: 'Annual Revenue',
  net_income: 'Net Income',
  owner_name: 'Owner Name',
  owner_ssn_last4: 'Last 4 SSN',
  address_line1: 'Address Line 1',
  address_line2: 'Address Line 2',
  city: 'City',
  state: 'State',
  zip: 'ZIP Code',
  cardholder_name: 'Cardholder Name',
  card_number: 'Card Number',
  expiry_date: 'Expiry Date',
  shipping_option: 'Shipping Option'
}

const steps = [
  { title: 'Business Information',        component: BusinessInfo },
  { title: 'Business Finances',           component: BusinessFinances },
  { title: 'Owner Verification',          component: OwnerVerify },
  { title: 'Primary Business Address',    component: PrimaryBusinessAddress },
  { title: 'Card Details',                component: CardDetails },
  { title: 'Card Shipment Info',          component: CardShipment },
  { title: 'Terms of Service',            component: TermsOfService }
]

async function fetchUserProfile(userId) {
  return await import('@/supabaseClient').then(({ supabase }) =>
    supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
  )
}

async function loadProfile(userId) {
  isLoading.value = true
  const { data, error } = await fetchUserProfile(userId)
  if (data && !error) {
    Object.assign(profile, data)
  } else {
    console.error('Error loading profile:', error)
    router.push({ name: 'signin' })
  }
  isLoading.value = false
}

watch(user, async (newUser) => {
  if (newUser?.id) {
    await loadProfile(newUser.id)
  } else {
    router.push({ name: 'signin' })
  }
}, { immediate: true })

function next() {
  if (stepValid.value && currentStep.value < steps.length - 1) {
    currentStep.value++
    stepValid.value = false
  }
}

function prev() {
  if (currentStep.value > 0) {
    currentStep.value--
    stepValid.value = true
  }
}

async function finish() {
  isLoading.value = true
  profile.is_finished = true
  const { error } = await import('@/supabaseClient').then(({ supabase }) =>
    supabase.from('user_profiles').upsert(profile)
  )
  if (error) alert('Save failed: ' + error.message)
  isLoading.value = false
}

async function saveChanges() {
  isLoading.value = true
  const { error } = await import('@/supabaseClient').then(({ supabase }) =>
    supabase.from('user_profiles').upsert(profile)
  )
  if (error) {
    alert('Save failed: ' + error.message)
  } else {
    editing.value = false
  }
  isLoading.value = false
}

onMounted(() => {
  console.log('ProfileView mounted')
})
</script>

<style scoped>
.profile-view {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Karla', sans-serif;
}
.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
.sign-out-btn {
  float: right;
  margin-bottom: 1rem;
  background: transparent;
  border: 1px solid #0c2442;
  color: #0c2442;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
}
.sign-out-btn:hover {
  background: #0c2442;
  color: white;
}
.profile-title {
  font-family: 'Sora', sans-serif;
  color: #0c2442;
  font-weight: 600;
  margin-bottom: 1rem;
  clear: both;
}
.wizard-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}
.wizard-nav button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  background: #0c2442;
  color: #fff;
  transition: background-color 0.3s;
}
.wizard-nav button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.wizard-nav button:hover:not(:disabled) {
  background: #092038;
}
.profile-summary .field {
  margin-bottom: 1rem;
}
.profile-summary label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.profile-summary input[readonly] {
  background-color: #f4f4f4;
  border: 1px solid #ccc;
}
.summary-actions {
  margin-top: 1.5rem;
}
.summary-actions button {
  padding: 0.5rem 1rem;
  background: #0c2442;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
}
</style>
