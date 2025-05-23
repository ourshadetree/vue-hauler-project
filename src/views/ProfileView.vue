<template>
  <div class="profile-view">
    <!-- Global loader while checking auth & loading profile -->
    <div v-if="isLoading" class="loading">Loading…</div>

    <div v-else>
      <!-- Sign Out -->
      <button class="sign-out-btn" @click="signOut">Sign Out</button>

      <!-- Wizard title or summary title -->
      <h2 class="profile-title">
        {{ profile.is_finished ? 'Your Profile' : steps[currentStep].title }}
      </h2>

      <!-- Multi‑step wizard -->
      <component
        v-if="!profile.is_finished"
        :is="steps[currentStep].component"
        v-model:profile="profile"
        @valid="stepValid = $event"
      />

      <!-- Summary when finished -->
      <ProfileSummary
        v-else
        :profile="profile"
        @edit="startEditing"
      />

      <!-- Navigation buttons -->
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
import { auth } from '@/composables/useAuth'  // Use the singleton auth state
import ProfileSummary         from '@/components/ProfileSummary.vue'
import BusinessInfo           from '@/components/wizard/BusinessInfo.vue'
import BusinessFinances       from '@/components/wizard/BusinessFinances.vue'
import UploadStatements       from '@/components/wizard/UploadStatements.vue'
import OwnerVerify            from '@/components/wizard/OwnerVerify.vue'
import ReviewOwners           from '@/components/wizard/ReviewOwners.vue'
import PrimaryBusinessAddress from '@/components/wizard/PrimaryBusinessAddress.vue'
import CardDetails            from '@/components/wizard/CardDetails.vue'
import CardShipment           from '@/components/wizard/CardShipment.vue'
import TermsOfService         from '@/components/wizard/TermsOfService.vue'

const router      = useRouter()
const { user, signOut, loading: authLoading } = auth  // Destructure auth from singleton

const isLoading   = ref(true)
const currentStep = ref(0)
const stepValid   = ref(false)

const profile = reactive({
  user_id:         null,
  first_name:      '',
  last_name:       '',
  company_name:    '',
  ein_number:      '',
  business_phone:  '',
  email_address:   '',
  annual_revenue:  '',
  net_income:      '',
  owner_name:      '',
  owner_ssn_last4: '',
  other_owners:    [],
  address_line1:   '',
  address_line2:   '',
  city:            '',
  state:           '',
  zip:             '',
  cardholder_name: '',
  card_number:     '',
  expiry_date:     '',
  shipping_option: 'standard',
  tos_agree:       false,
  is_finished:     false
})

const steps = [
  { title: 'Business Information',        component: BusinessInfo           },
  { title: 'Business Finances',           component: BusinessFinances       },
  { title: 'Upload Financial Statements', component: UploadStatements       },
  { title: 'Owner Verification',          component: OwnerVerify            },
  { title: 'Review Other Owners',         component: ReviewOwners           },
  { title: 'Primary Business Address',    component: PrimaryBusinessAddress },
  { title: 'Card Details',                 component: CardDetails            },
  { title: 'Card Shipment Info',          component: CardShipment           },
  { title: 'Terms of Service',             component: TermsOfService         }
]

async function loadProfile(userId) {
  isLoading.value = true
  const { data, error } = await fetchUserProfile(userId)
  if (data && !error) {
    Object.assign(profile, data)
  } else {
    console.error('Error loading profile:', error)
    // optionally: router.push({ name: 'signin' })
  }
  isLoading.value = false
}

async function fetchUserProfile(userId) {
  // Use supabase directly or refactor this to a composable method if you want
  return await import('@/supabaseClient').then(({ supabase }) =>
    supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
  )
}

// Load profile when user changes (e.g., on initial mount or sign in)
watch(user, async (newUser) => {
  if (newUser && newUser.id) {
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

function startEditing() {
  profile.is_finished = false
  currentStep.value = 0
  stepValid.value = true
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
</style>
