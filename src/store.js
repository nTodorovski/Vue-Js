import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    status: '',
    accessToken: localStorage.getItem('access_token') || '',
    currentUser: {
    },
    role: false
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token, user) {
      state.status = 'success'
      state.accessToken = token
      state.currentUser = user
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.accessToken = ''
      state.role = false
    },
    setIfAdmin(state){
      state.role = true;
    }
  },
  actions: {
    login({ commit }, currentUser) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: 'http://localhost:60733/api/Users/authenticate', data: currentUser, method: 'POST' })
          .then(resp => {
            const token = resp.data.token
            if(resp.data.id == 1){
              commit('setIfAdmin')
            }
            const currentUser = {
              id: resp.data.id,
              username: resp.data.username,
              firstName: resp.data.firstName,
              lastName: resp.data.lastName
            }
            localStorage.setItem('access_token', token)
            axios.defaults.headers.common['Authorization'] = "Bearer " + token
            commit('auth_success', token, currentUser)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('access_token')
            reject(err)
          })
      })
    },
    register({ commit }, currentUser) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: 'http://localhost:60733/api/Users/register', data: currentUser, method: 'POST' })
          .then(resp => {
            console.log("Registered")
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error', err)
            reject(err)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('access_token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },
    getTickets() {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:60733/api/Tickets/byUser', method: 'GET' })
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    placeTicket({ commit },ticket) {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:60733/api/Tickets/createticket', data: ticket, method: 'POST' })
          .then(resp => {
            console.log(resp);
            resolve(resp)
          })
          .catch(err => {
            console.log(err);
            reject(err)
          })
      })
    },
    getResults() {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:60733/api/RoundResults/getresult', method: 'GET' })
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    startRound() {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:60733/api/RoundResults/drawround', method: 'POST' })
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.accessToken,
    authStatus: state => state.status,
    isAdmin: state => state.role
  }
})