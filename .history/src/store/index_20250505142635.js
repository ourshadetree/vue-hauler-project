import { createStore } from 'vuex'
import { supabase } from '@/supabaseClient'

export default createStore({
  state: {
    // Existing state for navTools dotSearch
    mapCommand: null,
    dotSearchQuery: null,
    dotSearchResults: [],
    // New state for ActionCall's DOT search:
    dotSearchActionQuery: null,
    dotSearchActionResults: [],
    focusDotInput: false,
  },
  mutations: {
    // Existing mutations
    SET_MAP_COMMAND(state, command) {
      state.mapCommand = command
    },
    CLEAR_MAP_COMMAND(state) {
      state.mapCommand = null
    },
    SET_DOT_SEARCH_QUERY(state, query) {
      state.dotSearchQuery = query
    },
    CLEAR_DOT_SEARCH_QUERY(state) {
      state.dotSearchQuery = null
    },
    SET_DOT_SEARCH_RESULTS(state, results) {
      state.dotSearchResults = results
    },
    CLEAR_DOT_SEARCH_RESULTS(state) {
      state.dotSearchResults = []
    },
    // New mutations for dotSearchAction
    SET_DOT_SEARCH_ACTION_QUERY(state, query) {
      state.dotSearchActionQuery = query
    },
    CLEAR_DOT_SEARCH_ACTION_QUERY(state) {
      state.dotSearchActionQuery = null
    },
    SET_DOT_SEARCH_ACTION_RESULTS(state, results) {
      state.dotSearchActionResults = results
    },
    CLEAR_DOT_SEARCH_ACTION_RESULTS(state) {
      state.dotSearchActionResults = []
    },
    SET_FOCUS_DOT_INPUT(state) {
       state.focusDotInput = true  
    },
    CLEAR_FOCUS_DOT_INPUT(state) {
       state.focusDotInput = false 
    },
  },
  actions: {
    // Existing actions for navTools dotSearch & refreshMap
    refreshMap({ commit }) {
      commit('SET_MAP_COMMAND', 'refreshMap')
    },
    dotSearch({ commit }, dotNumber) {
      const parsedDOT = parseInt(dotNumber, 10)
      if (Number.isNaN(parsedDOT)) {
        console.error('Invalid DOT number:', dotNumber)
        return
      }
      commit('SET_DOT_SEARCH_QUERY', parsedDOT)
      commit('SET_MAP_COMMAND', 'dotSearch')
      // Query navTools potential_users if needed...
    },
    clearMapCommand({ commit }) {
      commit('CLEAR_MAP_COMMAND')
    },
    // New action for ActionCall component
    async dotSearchAction({ commit }, dotNumber) {
      const parsedDOT = parseInt(dotNumber, 10)
      if (Number.isNaN(parsedDOT)) {
        console.error('Invalid DOT number:', dotNumber)
        return
      }
      commit('SET_DOT_SEARCH_ACTION_QUERY', parsedDOT)
      // Query potential_users table to get business details along with mc_number
      const { data, error } = await supabase
        .from('potential_users')
        .select('business_name, city, state, mc_number')
        .eq('dot_number', parsedDOT)
      if (error) {
        console.error('Error fetching DOT search action results:', error)
      } else {
        console.log('DOT search action results:', data)
        commit('SET_DOT_SEARCH_ACTION_RESULTS', data)
      }
    }
  }
})
