import Vue from 'vue'
import Vuex from 'vuex'
import { eventBus } from '@/main'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    trips: [],
    changedTrips: [],
    idForNewTrip: null,
    initialIdForNewTrip: null
  },
  mutations: {
    CHANGE_PUSH_TRIP (state, payload) {
      state.changedTrips.push({ ...payload })
    },
    CHANGE_EDIT_TRIP (state, { id: tripId, ...tripItem }) {
      Vue.$set(state.changedTrips, state.changedTrips.findIndex(({ id }) => id === tripId), { id: tripId, ...tripItem })
    },
    CLEAR_CHANGES (state) {
      state.changedTrips = []
    },
    PUSH_TRIP (state, trip) {
      state.trips.push(trip)
    },
    SET_ID_FOR_NEW_TRIP (state, idForNewTrip) {
      state.idForNewTrip = idForNewTrip
      state.initialIdForNewTrip = idForNewTrip
    },
    INC_ID_FOR_NEW_TRIP (state) {
      state.idForNewTrip++
    },
    UPDATE_INITIAL_ID_FOR_NEW_TRIP (state) {
      state.idForNewTrip = state.initialIdForNewTrip
    }
  },
  actions: {
    async loadTrips ({ commit }) {
      const { trips, idForNew } = (await axios.get('trips.json')).data
      commit('SET_ID_FOR_NEW_TRIP', idForNew)
      trips.forEach(trip => commit('PUSH_TRIP', trip))
    },
    updateTrip ({ commit, state }, payload) {
      if (state.changedTrips.findIndex(({ id }) => id === payload.id) !== -1) {
        commit('CHANGE_EDIT_TRIP', payload)
      } else {
        commit('CHANGE_PUSH_TRIP', payload)
        commit('INC_ID_FOR_NEW_TRIP')
      }
    },
    cancelEdits ({ commit }) {
      commit('CLEAR_CHANGES')
      commit('UPDATE_INITIAL_ID_FOR_NEW_TRIP')
      eventBus.$emit('cancelEdits')
    },
    saveEdits () {}
  },
  getters: {
    tripsInfo: ({ trips, changedTrips }) => {
      return changedTrips.map(({ id, name }) => ({ id, name}))
        .concat(
          trips.map(({ id, name }) => ({ id, name}))
            .filter(({ id }) => changedTrips.findIndex(({ id: tripId }) => tripId === id) === -1)
        ).sort(({ id: idA }, { id: idB }) => idA - idB)
    },
    tripById: ({ trips, changedTrips }) => (tripId) => {
      if (changedTrips.findIndex(({ id }) => id === tripId) !== -1) {
        return changedTrips.find(({ id }) => id === tripId)
      } else {
        return trips.find(({ id }) => id === tripId)
      }
    },
    idForNewTrip: ({ idForNewTrip }) => idForNewTrip,
    isChanges: ({ changedTrips }) => changedTrips.length !== 0
  }
})
