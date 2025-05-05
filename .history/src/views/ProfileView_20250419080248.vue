<template>
    <div class="profile-view">
      <h2>Your Profile</h2>
      <form @submit.prevent="saveProfile">
        <div v-for="f in fields" :key="f.name" class="field">
          <label :for="f.name">{{ f.label }}</label>
          <input
            :id="f.name"
            v-model="profile[f.name]"
            type="text"
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive, onMounted } from 'vue'
  import { supabase } from '@/../supabaseClient'
  
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
    // get the currently signed-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error fetching user:', userError)
      return
    }
    if (!user) return
  
    // fetch their profile row
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
  
    if (error) {
      console.error('Error loading profile:', error)
    } else if (data) {
      Object.assign(profile, data)
    }
  })
  
  async function saveProfile() {
    // get the user again (to retrieve user.id)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      alert('Not signed in')
      return
    }
  
    const { error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: user.id, ...profile })
  
    if (error) {
      alert(`Save failed: ${error.message}`)
    } else {
      alert('Profile saved!')
    }
  }
  </script>
  
  <style scoped>
  .profile-view {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
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
  