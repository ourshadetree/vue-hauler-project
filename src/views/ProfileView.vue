<template>
  <div class="profile-page">
    <!-- Header: Profile Button + Crew Widget (only after profile completion) -->
    <div class="flex items-start justify-between mb-4">
      <!-- Button to open profile modal -->
      <button
        class="view-profile-btn"
        @click="openProfile"
      >
        View Your Profile
      </button>
      
    </div>

    <!-- Referral component always visible -->
    <FriendReferral />

    <!-- Profile Modal: shows registration for new users, summary for existing -->
    <div
      v-if="showProfileModal"
      class="modal-overlay"
      @click.self="handleOverlayClick"
    >
      <div class="modal-content">
        <button class="modal-close" @click="handleOverlayClick">×</button>

        <!-- Registration until profile is finished -->
        <RegistrationForm
          v-if="!profile.is_finished"
          :profile="profile"
          :isLoading="isLoading"
          :errorMessage="errorMessage"
          @try-close="handleOverlayClick"
          @signOut="signOut"
          @submit="finish"
        />

        <!-- Profile summary once complete -->
        <ProfileSummary
          v-else
          :profile="profile"
          :editing="editing"
          @edit="startEditing"
          @save="finish"
          @cancel="editing = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/composables/useAuth'
import { supabase } from '@/supabaseClient'

import FriendReferral   from '@/components/FriendReferral.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import ProfileSummary   from '@/components/ProfileSummary.vue'
import CrewWidget       from '@/components/CrewWidget.vue'

const router = useRouter()
const { user, signOut, loadUser } = auth

// Modal & state
const showProfileModal = ref(false)
const editing         = ref(false)
const errorMessage    = ref('')
const isLoading       = ref(true)

// Open in summary view
function openProfile() {
  showProfileModal.value = true
  editing.value = false
  errorMessage.value = ''
}
// Close modal
function closeModal() {
  showProfileModal.value = false
  errorMessage.value = ''
}
// Guard overlay or close actions
function handleOverlayClick() {
  if (!profile.is_finished) {
    alert('Please complete the form before closing.')
  } else {
    closeModal()
  }
}
// Switch to edit mode
function startEditing() {
  editing.value = true
}

// Reactive profile data
const profile = reactive({
  user_id: null,
  first_name: '',
  last_name: '',
  email_address: '',
  company_name: '',
  ein_number: '',
  business_phone: '',
  cell_number: '',
  dot_number: '',
  number_of_trucks: null,
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  zip: '',
  services: [],
  tos_agree: false,
  is_finished: false,
  invite_token: '',
  invite_url: ''
})

// Load or create profile
async function loadOrInitProfile(userId) {
  isLoading.value = true
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code === 'PGRST116') {
    const { data: newData } = await supabase
      .from('user_profiles')
      .insert({ user_id: userId })
      .single()
    Object.assign(profile, newData)
  } else if (data) {
    Object.assign(profile, data)
  }
  // If new user, show registration modal
  if (!profile.is_finished) openProfile()
  isLoading.value = false
}

// On mount, restore session
onMounted(async () => {
  await loadUser()
})
// Watch auth changes
watch(
  () => user.value,
  async u => {
    if (u?.id) await loadOrInitProfile(u.id)
    else router.push({ path: '/signin' })
  },
  { immediate: true }
)

// Submit handler
async function finish() {
  isLoading.value = true
  const wasNew = !profile.is_finished
  let token = ''

  // if brand-new, set flags & generate invite_token & URL
  if (wasNew) {
    profile.is_finished = true
    token = crypto.randomUUID()
    profile.invite_token = token
    const base = import.meta.env.VITE_APP_BASE_URL || window.location.origin
    profile.invite_url = `${base.replace(/\/$/, '')}/#/invite/${token}`
  }

  // Ensure numeric fields are numbers or null
  if (!Number.isInteger(profile.number_of_trucks)) profile.number_of_trucks = null

  // Upsert profile
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ ...toRaw(profile) })

  if (error) {
    alert('Save failed: ' + error.message)
    isLoading.value = false
    return
  }

  // Seed first invite into invites table
  if (wasNew && token) {
    const { error: inviteError } = await supabase
      .from('invites')
      .insert({ inviter_id: profile.user_id, code: token })
    if (inviteError) console.error('Error seeding invite:', inviteError)
  }

  // Close modal and notify
  editing.value = false
  closeModal()
  alert(wasNew
    ? 'Your profile has been successfully submitted!'
    : 'Your changes have been saved!'
  )

  isLoading.value = false
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Karla', sans-serif;
}
.view-profile-btn {
  background: #0C2442;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
}
.view-profile-btn:hover {
  background: #081A2A;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
