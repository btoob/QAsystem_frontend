import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import Antd from 'ant-design-vue'     按需引入
import {Icon} from 'ant-design-vue';
import {Comment} from "ant-design-vue";
import {List} from "ant-design-vue";
import {Avatar} from "ant-design-vue";
import {Form} from "ant-design-vue";
import {Button} from "ant-design-vue";
import {Input} from "ant-design-vue";
import {Tooltip} from "ant-design-vue";


import 'ant-design-vue/dist/antd.css'
import router from './router'
import App from './App.vue'

import {postKeyValueRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {postRequest} from "@/utils/api";

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;


Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(ElementUI);
// Vue.use(Antd);    会干扰element ui样式,
Vue.use(Icon)
Vue.use(Comment)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Form)
Vue.use(Button)
Vue.use(Input)
Vue.use(Tooltip)

import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { isCtrlPress } from '@/utils/keyboard'
Vue.use(mavonEditor)

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    // 在每次路由跳转的时候进行判断
    if (isCtrlPress()) {
        // 如果 ctrl 按键被按下，则以新窗口打开目标页面
        window.open('#' + to.fullPath)
        // 并阻止当前页面的跳转
        return next(false)
    } else {
        next()
    }
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
