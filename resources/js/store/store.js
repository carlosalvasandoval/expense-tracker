import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('access_token');
if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
axios.interceptors.request.use(function (config) {
    let token = localStorage.getItem('access_token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

export const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('access_token') || null,
        filter: 'all',
        expenses: [],
        errorMessage: '',
        years: [],
        months: []
    },
    getters: {
        isAuthenticated: state => !!state.token,
        loggedIn: state => state.token !== null,
        expenses: state => state.expenses,
        years: state => state.years,
        months: state => state.months,
        getErrorMessage: state => state.errorMessage
    },
    mutations: {
        addExpense(state, expense) {
            state.expenses.unshift(expense);
        },
        updateExpense(state, expenseUpdated) {
            const index = state.expenses.findIndex(expense => expense.id == expenseUpdated.id)
            let newArray = [...this.state.expenses]
            newArray[index] = { ...newArray[index] }
        },
        deleteExpense(state, id) {
            const index = state.expenses.findIndex(expense => expense.id == id)
            state.expenses.splice(index, 1);
        },
        retrieveYears(state, years) {
            state.years = years
        },
        retrieveMonths(state, months) {
            state.months = months
        },
        retrieveExpenses(state, expenses) {
            state.expenses = expenses
        },
        retrieveToken(state, token) {
            state.token = token
        },
        destroyToken(state) {
            state.token = null
        },
        setErrorMessage(state, error) {
            state.errorMessage = error;
        }
    },
    actions: {
        async destroyToken({ commit }) {
            commit('destroyToken');
            localStorage.removeItem('access_token');
        },
        async retrieveToken({ commit }, credentials) {
            try {
                let response = await axios
                    .post("/auth/login", {
                        email: credentials.email,
                        password: credentials.password,
                    });

                let accessToken = response.data.access_token;
                localStorage.setItem("access_token", accessToken);
                commit('retrieveToken', accessToken);
            } catch (error) {
                commit('setErrorMessage', error.response.data.error)
            }
        },
        async retrieveYears({ commit }) {
            let listYears = await axios.get('/expenses/list-years');
            commit('retrieveYears', listYears.data.data);
        },
        async retrieveMonths({ commit }, year) {
            let listMonths = await axios.get('/expenses/list-months/' + year);
            commit('retrieveMonths', listMonths.data.data);
        },
        async retrieveExpenses({ commit }, date) {
            let expenses = await axios.get(`/expenses/${date.month}/${date.year}`)
            commit('retrieveExpenses', expenses.data.data);
        },
        async addExpense({ commit }, expenseInputs) {
            let newExpense = await axios.post('/expenses', {
                item: expenseInputs.item,
                cost: expenseInputs.cost,
                year: expenseInputs.year,
                month: expenseInputs.month
            })
            commit('addExpense', newExpense.data.data);
            return newExpense.data.status;
        },
        async updateExpense({ commit }, expense) {
            try {
                let response = await axios.patch('/expenses/' + expense.id, {
                    item: expense.item,
                    cost: expense.cost,
                })
                commit('updateExpense', expense);
                return response.data.status;
            } catch (error) {
                return error.response.data.join();
            }

        },
        async deleteExpense({ commit }, id) {
            let response = await axios.delete('/expenses/' + id)
            commit('deleteExpense', id);
            return response.data.status;
        }
    }
})