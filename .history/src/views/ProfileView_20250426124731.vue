<template>
  <div class="profile-view">
    <!-- Banner -->
    <img class="banner" :src="haulerBanner" alt="Welcome Banner" />

    <!-- Complete Registration / Edit Info -->
    <div class="action-bar">
      <button
        v-if="incomplete"
        class="primary-btn"
        @click="editing = true"
      >
        Complete Registration
      </button>
      <button
        v-else
        class="secondary-btn"
        @click="editing = true"
      >
        Edit Info
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">Loading…</div>

    <!-- Profile form -->
    <form v-else @submit.prevent="saveProfile">
      <div v-for="f in fields" :key="f.name" class="field">
        <label :for="f.name">{{ f.label }}</label>
        <input
          :id="f.name"
          v-model="profile[f.name]"
          :placeholder="profile[f.name] || f.label"
          :disabled="!editing"
          type="text"
        />
      </div>

      <!-- Save shows only when editing -->
      <button
        v-if="editing"
        type="submit"
        class="primary-btn"
      >Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabaseClient'
import haulerBanner from '@/assets/haulerBanner.png'

const haulerBannerRef = haulerBanner
const isLoading = ref(true)
const editing   = ref(false)

// user profile data
const profile = reactive({
  first_name:       '',
  last_name:        '',
  email_address:    '',
  company_name:     '',
  dot_number:       '',
  mc_number:        '',
  business_phone:   '',
  duns_number:      '',
  fleet_type:       '',
  number_of_trucks: ''
})

// define which fields must be non‐empty to consider "complete"
const requiredFields = ['first_name', 'last_name']

// computed: true if any required field blank
const incomplete = computed(() =>
  requiredFields.some(key => !profile[key]?.toString().trim())
)

const fields = [
  { name: 'first_name',       label: 'First Name' },
  { name: 'last_name',        label: 'Last Name' },
  { name: 'email_address',    label: 'Email Address' },
  { name: 'company_name',     label: 'Company Name' },
  { name: 'dot_number',       label: 'DOT Number' },
  { name: 'mc_number',        label: 'MC Number' },
  { name: 'business_phone',   label: 'Business Phone' },
  { name: 'duns_number',      label: 'DUNS Number' },
  { name: 'fleet_type',       label: 'Fleet Type' },
  { name: 'number_of_trucks', label: 'Number of Trucks' }
]

onMounted(async () => {
  isLoading.value = true
  try {
    // 1) Get current user
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr) throw userErr
    if (!user) throw new Error('Not signed in')

    // 2) Load profile row
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    if (data) Object.assign(profile, data)

    // 3) ensure email_address is populated
    if (!profile.email_address && user.email) {
      profile.email_address = user.email
    }
  } catch (err) {
    console.error('Profile load error:', err)
  } finally {
    isLoading.value = false
  }
})

async function saveProfile() {
  try {
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) throw userErr || new Error('Not signed in')

    const { error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: user.id, ...profile })
    if (error) throw error

    alert('Profile saved!')
    editing.value = false
  } catch (err) {
    alert(`Save failed: ${err.message}`)
  }
}
</script>

<style scoped>
.profile-view {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Karla', sans-serif;
}

/* banner image */
.banner {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* action bar */
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
.primary-btn,
.secondary-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
}
.primary-btn {
  background: #0c2442;
  color: #fff;
}
.primary-btn:hover {
  background: #092038;
}
.secondary-btn {
  background: #f0f0f0;
  color: #0c2442;
  margin-right: 0.5rem;
}
.secondary-btn:hover {
  background: #e0e0e0;
}

/* loading */
.loading {
  text-align: center;
  padding: 2rem 0;
  color: #666;
}

/* form fields */
.field {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
input::placeholder {
  color: #aaa;
}

/* save button (reuses primary style) */
form > .primary-btn {
  margin-top: 1rem;
}
</style>
