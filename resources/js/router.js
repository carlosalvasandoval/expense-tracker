import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginComponent from './components/LoginComponent';
import ExpensesComponent from './components/ExpensesComponent';
import LogoutComponent from './components/LogoutComponent';
import { store } from './store/store';
import VueLodash from 'vue-lodash'
import lodash from 'lodash';
import VueMoment from 'vue-moment';
import VueFlashMessage from 'vue-flash-message';

Vue.use(VueFlashMessage);
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Vue.use(VueRouter);
Vue.use(VueMoment);

const token = localStorage.getItem('access_token')

const ifNotAuthenticated = (to, from, next) => {
    if (!store.getters.isAuthenticated) {
        next({
            name: 'login',
        })
        return
    }
    next()
}

const ifAuthenticated = (to, from, next) => {
    if (store.getters.isAuthenticated) {
        next({
            name: 'expenses',
        })
        return
    }
    next()
}

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginComponent,
            beforeEnter: ifAuthenticated,
        },
        {
            path: '/expenses',
            name: 'expenses',
            component: ExpensesComponent,
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: '/logout',
            name: 'logout',
            component: LogoutComponent,
            beforeEnter: ifNotAuthenticated,
        }
    ]
});

export default router;