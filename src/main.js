import Vue from 'vue'
import App from './App.vue'
import router from './router'
import $ from 'jquery'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {postKeyValueRequest} from "@/utils/api";
Vue.prototype.postKeyValueRequest=postKeyValueRequest;

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
