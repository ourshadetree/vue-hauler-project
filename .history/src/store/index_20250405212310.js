import { createStore } from 'vuex'

export default createStore({
  state: {
    // Command for the map component: 'refresh' or 'dotSearch'
    mapCommand: null,
    // The DOT number for potential_users
    dotSearchQuery: null,
    // The array of search results from potential_users
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

    // Called by nav tools -> sets mapCommand to "dotSearch" and sets dotSearchQuery
    dotSearch({ commit }, dotNumber) {
      const parsedDOT = parseInt(dotNumber, 10)
      if (Number.isNaN(parsedDOT)) {
        // You could handle the "Not a Number" case here, e.g. show an alert
        return
      }
      commit('SET_DOT_SEARCH_QUERY', parsedDOT)
      commit('SET_MAP_COMMAND', 'dotSearch')
    },

    // Called by map component once it fetches potential_users
    setDotSearchResults({ commit }, results) {
      commit('SET_DOT_SEARCH_RESULTS', results)
    },

    clearMapCommand({ commit }) {
      commit('CLEAR_MAP_COMMAND')
    }
  }
})
