import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Index from "@/views/Index";
import Question from "@/views/Question";
import Publish from "@/views/Publish";
import Profile from "@/views/Profile";
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'登录页面'
    }
  },
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta:{
      title:'首页'
    }
  },
  {
    path: '/question',
    name: 'Question',
    component: Question,
    meta:{
      //页面的标题
      title:'问题详情页'
    }
  },
  {
    path: '/publish',
    name: 'Publish',
    component: Publish,
    meta:{
      title:'问题发布页'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '个人问题详情页 '
    }
  },

]

const router = new VueRouter({
  routes
})

export default router
