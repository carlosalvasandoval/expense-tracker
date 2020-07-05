import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:8080/api/v1'

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('access_token') || null,
    errorMessage:''
  },
  getters: {
    getErrorServerMessage(state){
        return state.errorMessage;
    }
  },
  mutations: {
    retrieveToken(state, token) {
      state.token = token
    },
    setErrorMessage(state, error) {
        state.errorMessage = error;
    }
  },
  actions: {
    retrieveToken(context, credentials) {
        axios
          .post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          })
          .then(response => {
            let accessToken =response.data.access_token;
            localStorage.setItem("access_token", accessToken);
            context.commit('retrieveToken', accessToken)
          })
          .catch(error => {
            context.commit('setErrorMessage', error.response.data.error)
          });
    },
  }
})