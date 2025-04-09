import { createStore } from 'vuex'

export default createStore({
  state: {
    // Command for the map component: 'refresh' or 'dotSearch'
    mapCommand: null,
    // For DOT search: the query string (DOT number)
    dotSearchQuery: null,
    // Results from DOT search
    dotSearchResults: []
  },
  mutations: {
    SET_MAP_COMMAND(state, command) {
      state.mapCommand = command;
    },
    CLEAR_MAP_COMMAND(state) {
      state.mapCommand = null;
    },
    SET_DOT_SEARCH_QUERY(state, query) {
      state.dotSearchQuery = query;
    },
    CLEAR_DOT_SEARCH_QUERY(state) {
      state.dotSearchQuery = null;
    },
    SET_DOT_SEARCH_RESULTS(state, results) {
      state.dotSearchResults = results;
    },
    CLEAR_DOT_SEARCH_RESULTS(state) {
      state.dotSearchResults = [];
    }
  },
  actions: {
    refreshMap({ commit }) {
      commit('SET_MAP_COMMAND', 'refresh');
    },
    dotSearch({ commit }, dotNumber) {
      commit('SET_DOT_SEARCH_QUERY', dotNumber);
      commit('SET_MAP_COMMAND', 'dotSearch');
    },
    setDotSearchResults({ commit }, results) {
      commit('SET_DOT_SEARCH_RESULTS', results);
    },
    clearMapCommand({ commit }) {
      commit('CLEAR_MAP_COMMAND');
    }
  },
  modules: {
    // You can add more modules if needed.
  }
});
