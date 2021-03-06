// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import myaxios from '../src/assets/js/myaxios.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
import bread from './components/layout/bread.vue'

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(myaxios)

Vue.component(bread.name, bread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
