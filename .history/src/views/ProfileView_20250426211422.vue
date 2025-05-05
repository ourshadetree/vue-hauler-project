<template>
  <div class="profile-view">
    <!-- 1) Page title and instruction -->
    <h2 class="profile-title">Profile Information</h2>
    <p class="profile-instruction">
      {{ incomplete
         ? 'Please complete your registration below.'
         : 'Click “Edit Info” to make changes to your profile.' }}
    </p>

    <!-- 2) Banner always shown -->
    <img class="banner" :src="haulerBanner" alt="Welcome Banner" />

    <!-- 3) Complete vs. Edit button -->
    <div class="action-bar">
      <button
        class="primary-btn"
        @click="editing = true"
      >
        {{ incomplete ? 'Complete Registration' : 'Edit Info' }}
      </button>
    </div>

    <!-- 4) Loading overlay -->
    <div v-if="isLoading" class="loading">Loading…</div>

    <!-- 5) Form -->
    <form v-if="!isLoading" @submit.prevent="saveProfile">
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

      <!-- only show Save when you’re actually editing -->
      <button
        v-if="editing"
        type="submit"
        class="primary-btn save-btn"
      >
        Save
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { supabase } from '@/supabaseClient'
import haulerBanner from '@/assets/haulerBanner.png'

const haulerBannerRef = haulerBanner
const isLoading = ref(false)
const editing   = ref(false)

// your data model
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

// which fields must be non-blank before we consider the user “complete”?
const requiredFields = ['first_name', 'last_name']

// true if any required field is still blank
const incomplete = computed(() =>
  requiredFields.some(key => !String(profile[key]||'').trim())
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
    // 1) Get the current user (if any)
    const {
      data: { user },
      error: userErr
    } = await supabase.auth.getUser()
    if (userErr) console.error('Auth error:', userErr)

    // 2) Fetch their profile row (if they’re signed in)
    if (user?.id) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error)
      } else if (data) {
        Object.assign(profile, data)
      }

      // 3) fill in email if empty
      if (!profile.email_address && user.email) {
        profile.email_address = user.email
      }
    }
  } catch (err) {
    console.error('Unexpected load error:', err)
  } finally {
    isLoading.value = false
  }
})

async function saveProfile() {
  try {
    const {
      data: { user },
      error: userErr
    } = await supabase.auth.getUser()
    if (userErr || !user) throw userErr || new Error('Must be signed in')

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

/* title + instruction */
.profile-title {
  font-family: 'Sora', sans-serif;
  color: #0c2442;
  margin-bottom: 0.25rem;
}
.profile-instruction {
  color: #555;
  margin-bottom: 1rem;
}

/* banner image */
.banner {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* Complete/Edit button */
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
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
.secondary-btn {
  /* if you ever need a different look for Edit Info */
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

/* form */
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

/* save button */
.save-btn {
  margin-top: 1rem;
}
</style>
