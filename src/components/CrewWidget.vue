<!-- src/components/CrewWidget.vue -->
<template>
    <div class="crew-widget">
      <!-- Header -->
      <div class="header">
        <h2>Tell a Trucker</h2>
        <button class="invite-btn" @click="showNewCrewModal = true">
          Create New Crew
        </button>
      </div>
  
      <!-- Intro text -->
      <p class="intro-text">
        Invite your friends to get lower fuel prices. When they join, your
        crew gains buying power. We track your group's total gallons to fight
        for the deals you want.
      </p>
  
      <!-- Loading / Empty States -->
      <div v-if="isLoading" class="loading">Loading…</div>
      <div v-else-if="invites.length === 0" class="empty">
        You have no invites yet.
      </div>
  
      <!-- Invite Cards -->
      <div v-else class="invite-list">
        <div
          v-for="invite in invites"
          :key="invite.id"
          class="invite-card"
        >
          <!-- Crew Info -->
          <div class="crew-info">
            <span class="crew-name">{{ invite.crewName }}</span>
            <span class="member-count">
              {{ invite.membersCount }} member<span v-if="invite.membersCount !== 1">s</span>
            </span>
          </div>
  
          <!-- Invite Link + Send -->
          <div class="link-row">
            <code class="invite-code">{{ inviteLink(invite.code) }}</code>
            <button class="send-btn" @click="openSendModal(invite)">
              Send Invite
            </button>
          </div>
  
          <!-- Stats -->
          <div class="stats">
            Clicks: <span>{{ invite.clicks }}</span> |
            Created: <span>{{ formatDate(invite.created_at) }}</span>
          </div>
  
          <!-- Details -->
          <button class="details-btn" @click="viewDetails(invite)">
            View Details
          </button>
        </div>
      </div>
  
      <!-- Create New Crew Modal -->
      <Modal v-if="showNewCrewModal" @close="showNewCrewModal = false">
        <template #header>
          <h3>Create New Crew</h3>
        </template>
        <template #body>
          <input
            v-model="newCrewName"
            type="text"
            placeholder="Crew Name"
            class="crew-name-input"
          />
        </template>
        <template #footer>
          <button
            class="invite-btn"
            @click="createCrew"
            :disabled="!newCrewName.trim()"
          >
            Create Crew
          </button>
        </template>
      </Modal>
  
      <!-- Send Invite Modal -->
      <Modal v-if="showSendModal" @close="showSendModal = false">
        <template #header>
          <h3>Send Invite</h3>
        </template>
        <template #body>
          <p>
            Invite link for <strong>{{ activeInvite?.crewName }}</strong>:
          </p>
          <code class="invite-code">{{ inviteLink(activeInvite.code) }}</code>
          <input
            v-model="inviteEmail"
            type="email"
            placeholder="friend@example.com"
            class="crew-name-input"
          />
        </template>
        <template #footer>
          <button class="btn secondary-btn" @click="showSendModal = false">
            Cancel
          </button>
          <button
            class="invite-btn"
            @click="sendEmail"
            :disabled="!validEmail(inviteEmail)"
          >
            Send
          </button>
        </template>
      </Modal>
  
      <!-- Details Modal -->
      <Modal v-if="showModal" @close="showModal = false">
        <template #header>
          <h3>Invite Details</h3>
        </template>
        <template #body>
          <p class="detail-line">
            <strong>Link:</strong>
            <code class="invite-code">{{ inviteLink(selectedInvite.code) }}</code>
          </p>
          <div v-if="referrals.length">
            <h4>Referrals:</h4>
            <ul class="ref-list">
              <li v-for="ref in referrals" :key="ref.id">
                {{ ref.referred_user_id }} at {{ formatDate(ref.referred_at) }}
              </li>
            </ul>
          </div>
          <div v-else class="empty">No referrals yet.</div>
        </template>
        <template #footer>
          <button class="invite-btn" @click="showModal = false">
            Close
          </button>
        </template>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { supabase, sendInviteEmail } from '@/supabaseClient.js'
  import { nanoid } from 'nanoid'
  import Modal from '@/components/Modal.vue'
  
  /** Raw invite from DB */
  interface InviteRaw {
    id: string
    code: string
    clicks: number
    created_at: string
    inviter_id: string
    crew_id: string
  }
  /** Augmented for UI */
  interface Invite extends InviteRaw {
    crewName: string
    membersCount: number
  }
  interface Referral {
    id: string
    referred_user_id: string
    referred_at: string
  }
  
  const userId = ref<string>('')
  const invites = ref<Invite[]>([])
  const referrals = ref<Referral[]>([])
  const isLoading = ref<boolean>(false)
  
  // Details modal
  const showModal = ref<boolean>(false)
  const selectedInvite = ref<Invite>({} as Invite)
  
  // Create-crew modal
  const showNewCrewModal = ref<boolean>(false)
  const newCrewName = ref<string>('')
  
  // Send-invite modal
  const showSendModal = ref<boolean>(false)
  const activeInvite = ref<Invite>({} as Invite)
  const inviteEmail = ref<string>('')
  
  /** Build full URL */
  function inviteLink(code: string) {
    return `${window.location.origin}/invite/${code}`
  }
  /** Pretty-print date */
  function formatDate(ts: string) {
    return new Date(ts).toLocaleDateString()
  }
  
  /** Load all invites, then fetch crew name + member count per invite */
  async function loadInvites() {
    isLoading.value = true
    try {
      const { data: raw, error } = await supabase
        .from<InviteRaw>('invites')
        .select('*')
        .eq('inviter_id', userId.value)
        .order('created_at', { ascending: false })
      if (!raw || error) {
        invites.value = []
        return
      }
  
      const enriched: Invite[] = []
      for (const inv of raw) {
        // 1) Crew name
        let crewName = 'Unnamed Crew'
        if (inv.crew_id) {
          const { data: c } = await supabase
            .from('crews')
            .select('name')
            .eq('id', inv.crew_id)
            .single()
          if (c) crewName = c.name
        }
        // 2) Member count
        let membersCount = 0
        if (inv.crew_id) {
          const { count } = await supabase
            .from('crew_members')
            .select('id', { count: 'exact', head: true })
            .eq('crew_id', inv.crew_id)
          membersCount = count ?? 0
        }
        enriched.push({ ...inv, crewName, membersCount })
      }
      invites.value = enriched
    } catch (e) {
      console.error('loadInvites error:', e)
      invites.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  /** Create a new crew + invite for it */
  async function createCrew() {
    if (!newCrewName.value.trim()) return
    const { data: cdata, error: cerr } = await supabase
      .from('crews')
      .insert({ inviter_id: userId.value, name: newCrewName.value.trim() })
      .select('id')
      .single()
    if (cerr || !cdata) {
      console.error('Crew create err', cerr)
      return
    }
    const code = nanoid()
    await supabase
      .from('invites')
      .insert({ inviter_id: userId.value, crew_id: cdata.id, code })
    // Copy link to clipboard
    navigator.clipboard.writeText(inviteLink(code))
    showNewCrewModal.value = false
    newCrewName.value = ''
    await loadInvites()
  }
  
  /** Show details modal */
  async function viewDetails(inv: Invite) {
    selectedInvite.value = inv
    isLoading.value = true
    const { data } = await supabase
      .from('referrals')
      .select('*')
      .eq('invite_id', inv.id)
      .order('referred_at', { ascending: false })
    referrals.value = data || []
    isLoading.value = false
    showModal.value = true
  }
  
  /** Open the Send Invite modal */
  function openSendModal(inv: Invite) {
    activeInvite.value = inv
    inviteEmail.value = ''
    showSendModal.value = true
  }
  /** Simple email validation */
  function validEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  /** Call your Edge Function to send the email */
  async function sendEmail() {
    try {
      await sendInviteEmail(activeInvite.value.id, inviteEmail.value)
      alert(`Invite sent to ${inviteEmail.value}!`)
      showSendModal.value = false
    } catch (err: any) {
      alert(`Failed to send: ${err.message || err}`)
    }
  }
  
  /** On mount, grab current session and load */
  onMounted(async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    if (session?.user.id) {
      userId.value = session.user.id
      await loadInvites()
    }
  })
  </script>
  
  <style scoped>
  .crew-widget {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    padding: 1.5rem;
    font-family: 'Karla', sans-serif;
    width: 100%;
    max-width: 480px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .header h2 {
    font-family: 'Sora', sans-serif;
    font-size: 1.5rem;
    color: #0C2442;
  }
  .invite-btn {
    background: #0C2442;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
  }
  .invite-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .invite-btn:hover:not(:disabled) {
    background: #081A2A;
  }
  .intro-text {
    font-size: 0.9rem;
    color: #4A5568;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
  .loading, .empty {
    text-align: center;
    color: #718096;
    padding: 1rem 0;
  }
  .invite-list .invite-card {
    padding: 0.75rem;
    border: 1px solid #E2E8F0;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    transition: background 0.2s;
  }
  .invite-card:hover {
    background: #F7FAFC;
  }
  .crew-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .crew-name {
    font-weight: bold;
    color: #0C2442;
  }
  .member-count {
    font-size: 0.85rem;
    color: #718096;
  }
  .link-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .invite-code {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: #0C2442;
    word-break: break-all;
  }
  .send-btn {
    background: none;
    border: none;
    color: #B11818;
    cursor: pointer;
    font-size: 0.875rem;
  }
  .send-btn:hover {
    text-decoration: underline;
  }
  .stats {
    font-size: 0.75rem;
    color: #718096;
    margin: 0.5rem 0;
  }
  .details-btn {
    background: none;
    border: none;
    color: #0C2442;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .details-btn:hover {
    text-decoration: underline;
  }
  .detail-line {
    margin-bottom: 1rem;
  }
  .ref-list {
    list-style: disc inside;
    color: #4A5568;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  /* Inputs inside modals */
  .crew-name-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #D1D5DB;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-family: 'Karla', sans-serif;
  }
  /* Secondary button for cancel */
  .btn.secondary-btn {
    @apply px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400;
  }
  </style>
  