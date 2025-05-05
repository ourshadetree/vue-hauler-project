<template>
  <div class="profile-view">
    <!-- Banner -->
    <img class="banner" :src="haulerBanner" alt="Welcome Banner" />

    <!-- Header + Edit button -->
    <div class="form-header">
      <h2>Your Profile</h2>
      <button v-if="!editing" class="edit-btn" @click="editing = true">
        Edit Info
      </button>
    </div>

    <!-- Loading state -->
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

      <!-- only show Save button when editing -->
      <button
        v-if="editing"
        type="submit"
        class="save-btn"
      >Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { supabase } from '@/supabaseClient'
import haulerBanner from '@/assets/haulerBanner.png'

const haulerBannerRef = haulerBanner
const isLoading = ref(true)
const editing = ref(false)

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
    // get signed-in user
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr) throw userErr
    if (!user) throw new Error('No user')

    // fetch their profile row
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    if (data) Object.assign(profile, data)

    // if no email in profile yet, default to auth email
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

/* banner */
.banner {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* header + edit button */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.edit-btn {
  background: #0c2442;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit-btn:hover {
  background: #092038;
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
  color: #333;
}
input::placeholder {
  color: #aaa;
}

/* save button */
.save-btn {
  background: #0c2442;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.save-btn:hover {
  background: #092038;
}
</style>
