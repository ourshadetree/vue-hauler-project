<template>
    <div class="profile-view">
      <h2>Your Profile</h2>
  
      <!-- show a spinner or message while fetching -->
      <div v-if="isLoading" class="loading">Loading…</div>
  
      <form v-else @submit.prevent="saveProfile">
        <div v-for="f in fields" :key="f.name" class="field">
          <label :for="f.name">{{ f.label }}</label>
          <input
            :id="f.name"
            v-model="profile[f.name]"
            type="text"
            placeholder="—"
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, onMounted } from 'vue'
  import { supabase } from '@/supabaseClient'
  
  const isLoading = ref(true)
  const profile = reactive({
    dot_number:       '',
    mc_number:        '',
    company_name:     '',
    business_phone:   '',
    duns_number:      '',
    fleet_type:       '',
    first_name:       '',
    last_name:        '',
    email_address:    '',
    number_of_trucks: ''
  })
  
  const fields = [
    { name: 'dot_number',       label: 'DOT Number' },
    { name: 'mc_number',        label: 'MC Number' },
    { name: 'company_name',     label: 'Company Name' },
    { name: 'business_phone',   label: 'Business Phone' },
    { name: 'duns_number',      label: 'DUNS Number' },
    { name: 'fleet_type',       label: 'Fleet Type' },
    { name: 'first_name',       label: 'First Name' },
    { name: 'last_name',        label: 'Last Name' },
    { name: 'email_address',    label: 'Email Address' },
    { name: 'number_of_trucks', label: 'Number of Trucks' }
  ]
  
  onMounted(async () => {
    try {
      // get current user
      const {
        data: { user },
        error: userErr
      } = await supabase.auth.getUser()
      const currentUser = session?.user
     console.log('🔍 currentUser:', currentUser)
      if (userErr) throw userErr
      if (!user) {
        console.warn('No user signed in')
        return
      }
  
      // fetch profile
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .select('*')
       // make sure this column name matches your table schema!
       .eq('user_id', currentUser.id)
        .single()
  
        console.log('🔍 profile fetch:', { data, error })
      if (error && error.code !== 'PGRST116') {
        // code PGRST116 means “no rows found”—safe to ignore
        throw error
      }
  
      // if data exists, merge into our reactive object
      if (data) {
        Object.assign(profile, data)
      }
    } catch (err) {
      console.error('Profile load error:', err)
    } finally {
      isLoading.value = false
    }
  })
  
  async function saveProfile() {
    try {
      // get user again
      const {
        data: { user },
        error: userErr
      } = await supabase.auth.getUser()
      if (userErr || !user) {
        alert('You must be signed in to save your profile.')
        return
      }
  
      // upsert their profile row
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ user_id: user.id, ...profile })
  
      if (error) throw error
      alert('Profile saved!')
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
  }
  .loading {
    text-align: center;
    padding: 2rem 0;
    color: #666;
  }
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
  button[type="submit"] {
    padding: 0.5rem 1rem;
    background: #0C2442;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button[type="submit"]:hover {
    background: #092038;
  }
  </style>
  