import { createStore } from 'vuex'

export default createStore({
  state: {
    // Command for the map component: e.g., 'refresh' or 'dotSearch'
    mapCommand: null,
    // DOT search query (e.g., the DOT number entered by the user)
    dotSearchQuery: null,
    // Results returned from a DOT search (an array of objects)
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
    refreshMap({ commit }) {
      commit('SET_MAP_COMMAND', 'refresh')
    },
    dotSearch({ commit }, dotNumber) {
      commit('SET_DOT_SEARCH_QUERY', dotNumber)
      commit('SET_MAP_COMMAND', 'dotSearch')
    },
    setDotSearchResults({ commit }, results) {
      commit('SET_DOT_SEARCH_RESULTS', results)
    },
    clearMapCommand({ commit }) {
      commit('CLEAR_MAP_COMMAND')
    }
  },
  modules: {}
})
