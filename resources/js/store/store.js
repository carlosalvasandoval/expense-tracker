import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:8080/api/v1'

const token = localStorage.getItem('access_token')
if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

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
        loggedIn(state) {
            return state.token !== null
        },
        expenses: state => state.expenses,
        years: state => state.years,
        months: state => state.months,
        expensesFiltered(state) {
            if (state.filter == 'all') {
                return state.expenses
            } else if (state.filter == 'active') {
                return state.expenses.filter(expense => !expense.completed)
            } else if (state.filter == 'completed') {
                return state.expenses.filter(expense => expense.completed)
            }
            return state.expenses
        },
        getErrorMessage(state) {
            return state.errorMessage;
        }
    },
    mutations: {
        addExpense(state, expense) {
            state.expenses.data.unshift(expense.data);
        },
        updateExpense(state, expense) {
            const index = state.expenses.data.findIndex(item => item.id == expense.id)
            state.expenses.data.splice(index, 1, {
                'item': expense.item,
                'cost': expense.cost
            })
        },
        deleteExpense(state, id) {
            const index = state.expenses.data.findIndex(expense => expense.id == id)
            state.expenses.data.splice(index, 1);
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
        clearexpenses(state) {
            state.expenses = []
        },
        setErrorMessage(state, error) {
            state.errorMessage = error;
        }
    },
    actions: {
       
        destroyToken(context) {
            return new Promise((resolve, reject) => {
                context.commit('destroyToken');
                localStorage.removeItem('access_token');
                resolve()
            })
        },
        retrieveToken(context, credentials) {
            return new Promise((resolve, reject) => {
                axios
                    .post("/auth/login", {
                        email: credentials.email,
                        password: credentials.password,
                    })
                    .then(response => {
                        let accessToken = response.data.access_token;
                        localStorage.setItem("access_token", accessToken);
                        context.commit('retrieveToken', accessToken)
                        resolve(response)
                    })
                    .catch(error => {
                        context.commit('setErrorMessage', error.response.data.error)
                        reject(error)
                    });
            })

        },
        retrieveYears(context) {
            return new Promise((resolve, reject) => {
                axios.get('/expenses/list-years')
                    .then(response => {
                        context.commit('retrieveYears', response.data);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        retrieveMonths(context, year) {
            return new Promise((resolve, reject) => {
                axios.get('/expenses/list-months/' + year)
                    .then(response => {
                        context.commit('retrieveMonths', response.data);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        retrieveExpenses(context, date) {
            return new Promise((resolve, reject) => {
                axios.get(`/expenses/${date.year}/6`)
                    .then(response => {
                        context.commit('retrieveExpenses', response.data);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        addExpense(context, expense) {
            return new Promise((resolve, reject) => {
                axios.post('/expenses', {
                    item: expense.item,
                    cost: expense.cost,
                })
                    .then(response => {
                        context.commit('addExpense', response.data)
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        updateExpense(context, expense) {
            axios.patch('/expenses/' + expense.id, {
                title: expense.title,
                completed: expense.completed,
            })
                .then(response => {
                    context.commit('updateExpense', response.data)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deleteExpense(context, id) {
            return new Promise((resolve, reject) => {
                axios.delete('/expenses/' + id)
                    .then(response => {
                        context.commit('deleteExpense', id);
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            });
        }
    }
})