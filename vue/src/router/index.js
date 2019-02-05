import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login.vue'
import home from '../components/page/home.vue'
import users from '../components/page/users/users.vue'
import rights from '../components/page/rights/rights.vue'
import roles from '../components/page/roles/roles.vue'
import goods from '../components/page/goods/goods.vue'
import add from '../components/page/goods/add.vue'
import categories from '../components/page/categories/categories.vue'


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
          path: '/users',
          component: users
        },
        {
          path: '/rights',
          component: rights
        },
        {
          path: '/roles',
          component: roles
        },
        {
          path: '/goods',
          component: goods
        },
        {
          path: '/goods/add',
          component: add
        },
        {
          path: '/categories',
          component: categories
        }
      ]
    }
  ]
})
