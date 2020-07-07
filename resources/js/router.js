import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from './components/Login';
import Expenses from './components/Expenses';
import Logout from './components/Logout';
import { store } from './store/store';
import VueLodash from 'vue-lodash'
import lodash from 'lodash';
import VueMoment from 'vue-moment';
import VueFlashMessage from 'vue-flash-message';

Vue.use(VueFlashMessage);
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Vue.use(VueRouter);
Vue.use(VueMoment);

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
            component: Login,
            beforeEnter: ifAuthenticated,
        },
        {
            path: '/expenses',
            name: 'expenses',
            component: Expenses,
            beforeEnter: ifNotAuthenticated,
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout,
            beforeEnter: ifNotAuthenticated,
        }
    ]
});

export default router;