import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Index from "@/views/Index";
import Question from "@/views/Question";
import Publish from "@/views/Publish";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/index',
    name: 'Index',
    component: Index
  },
  {
    path: '/question',
    name: 'Question',
    component: Question
  },
  {
    path: '/publish',
    name: 'Publish',
    component: Publish
  },

]

const router = new VueRouter({
  routes
})

export default router
