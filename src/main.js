import Vue from 'vue'
import App from './App.vue'
import router from './router'
import  store  from  './store'
import  Axios  from  'axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue)

Vue.config.productionTip = false
Vue.prototype.$http  =  Axios;
const  accessToken  =  localStorage.getItem('access_token')

if (accessToken) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] =  'Bearer ' + accessToken;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
