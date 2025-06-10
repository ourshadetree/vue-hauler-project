<template>
  <div class="profile-view">
    <div v-if="isLoading" class="loading">Loading…</div>
    <div v-else>
      <button class="sign-out-btn" @click="signOut">Sign Out</button>
      <h2 class="profile-title">
        {{ profile.is_finished ? 'Your Profile' : steps[currentStep].title }}
      </h2>

      <component
        v-if="showWizard"
        :is="steps[currentStep].component"
        v-model:profile="profile"
        @valid="stepValid = $event"
      />

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
            <button
              v-if="!editing"
              type="button"
              @click="editing = true"
            >
              Edit Info
            </button>
            <button v-else type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div v-if="showWizard" class="wizard-nav">
        <button @click="prev" :disabled="currentStep === 0">
          Back
        </button>
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
import { ref, reactive, onMounted, watch, computed, nextTick, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/composables/useAuth'
import { supabase } from '@/supabaseClient'  
// static import guarantees supabase is defined

import BusinessInfo           from '@/components/wizard/BusinessInfo.vue'
import BusinessFinances       from '@/components/wizard/BusinessFinances.vue'
import OwnerVerify            from '@/components/wizard/OwnerVerify.vue'
import PrimaryBusinessAddress from '@/components/wizard/PrimaryBusinessAddress.vue'
import CardDetails            from '@/components/wizard/CardDetails.vue'
import CardShipment           from '@/components/wizard/CardShipment.vue'
import TermsOfService         from '@/components/wizard/TermsOfService.vue'

// Reactive state
const router       = useRouter()
const { user, signOut, loading: authLoading } = auth
const isLoading    = ref(true)
const currentStep  = ref(0)
const stepValid    = ref(false)
const editing      = ref(false)

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
  'first_name','last_name','company_name','ein_number',
  'business_phone','email_address','annual_revenue','net_income',
  'owner_name','owner_ssn_last4','address_line1','address_line2',
  'city','state','zip','cardholder_name','card_number',
  'expiry_date','shipping_option'
]

const fieldLabels = {
  first_name:      'First Name',
  last_name:       'Last Name',
  company_name:    'Company Name',
  ein_number:      'EIN Number',
  business_phone:  'Business Phone',
  email_address:   'Email Address',
  annual_revenue:  'Annual Revenue',
  net_income:      'Net Income',
  owner_name:      'Owner Name',
  owner_ssn_last4: 'Last 4 SSN',
  address_line1:   'Address Line 1',
  address_line2:   'Address Line 2',
  city:            'City',
  state:           'State',
  zip:             'ZIP Code',
  cardholder_name: 'Cardholder Name',
  card_number:     'Card Number',
  expiry_date:     'Expiry Date',
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

const showWizard = computed(() =>
  !profile.is_finished && currentStep.value >= 0
)

async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
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

  const updatedProfile = { ...profile, is_finished: true }
  console.log(toRaw(updatedProfile))
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ ...toRaw(updatedProfile) })

  if (error) {
    alert('Save failed: ' + error.message)
    isLoading.value = false
    return
  }

  profile.is_finished = true
  await nextTick()
  isLoading.value = false
  alert('Your application has been submitted!')
}

async function saveChanges() {
  isLoading.value = true

  // Upsert the current profile
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ ...toRaw(profile) })

  if (error) {
    alert('Save failed: ' + error.message)
  } else {
    editing.value = false
  }
  isLoading.value = false
}

onMounted(async () => {
  console.log('ProfileView mounted')
  if (!user.value?.id) {
    const { loadUser } = auth
    await loadUser()
  }
  if (user.value?.id) {
    console.log('[mount] User loaded. Loading profile...')
    await loadProfile(user.value.id)
  }
})
</script>

<style scoped>
.profile-view {
  margin-left: 120px;
  margin-top: 50px;
  padding: 20px;
  max-width: 700px;
  font-family: 'Karla', sans-serif;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #0C2442;
  padding: 2rem;
}

.sign-out-btn {
  float: right;
  margin-bottom: 1rem;
  background: #B11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
}
.sign-out-btn:hover {
  background: #8F1212;
}

.profile-title {
  font-family: 'Sora', sans-serif;
  color: #0C2442;
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  clear: both;
}

.wizard-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}
.wizard-nav button {
  background: #B11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
}
.wizard-nav button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.wizard-nav button:hover:not(:disabled) {
  background: #8F1212;
}

.profile-summary .field {
  margin-bottom: 1rem;
}
.profile-summary label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #0C2442;
}
.profile-summary input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Karla', sans-serif;
}
.profile-summary input[readonly] {
  background-color: #f4f4f4;
}

.summary-actions {
  margin-top: 1.5rem;
}
.summary-actions button {
  background: #B11818;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
}
.summary-actions button:hover {
  background: #8F1212;
}
</style>

