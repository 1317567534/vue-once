import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login.vue'
import home from '../components/page/home.vue'
import users from '../components/page/users/users.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'home',
      path: '/home',
      component: home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: users
        }
      ]
    }
  ]
})
