import { createStore } from 'vuex'
import { supabase } from '@/../supabaseClient'

export default createStore({
  state: {
    mapCommand: null,
    dotSearchQuery: null,
    dotSearchResults: []
  },
  mutations: {
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
    }
  },
  actions: {
    // Called by nav tools -> sets mapCommand to "refresh"
    refreshMap({ commit }) {
      commit('SET_MAP_COMMAND', 'refresh')
    },

    // Updated DOT search action to query the database
    async dotSearch({ commit }, dotNumber) {
      const parsedDOT = parseInt(dotNumber, 10)
      if (Number.isNaN(parsedDOT)) {
        // Optionally handle the "Not a Number" case, for example by showing an alert.
        console.error('Invalid DOT number:', dotNumber)
        return
      }
      // Set the query and command in the state.
      commit('SET_DOT_SEARCH_QUERY', parsedDOT)
      commit('SET_MAP_COMMAND', 'dotSearch')

      // Perform the query against the potential_users table.
      const { data, error } = await supabase
        .from('potential_users')
        .select('business_name, city, state')
        .eq('dot_number', parsedDOT)

      if (error) {
        console.error('Error fetching DOT search results:', error)
      } else {
        console.log('DOT search results:', data)
        // Commit the fetched results to the Vuex state.
        commit('SET_DOT_SEARCH_RESULTS', data)
      }
    },

    // Called by map component once it fetches potential_users (if using a separate query)
    setDotSearchResults({ commit }, results) {
      commit('SET_DOT_SEARCH_RESULTS', results)
    },

    clearMapCommand({ commit }) {
      commit('CLEAR_MAP_COMMAND')
    }
  }
})
