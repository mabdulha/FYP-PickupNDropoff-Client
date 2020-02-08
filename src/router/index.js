import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/authentication/Register.vue'
import RegisterDriver from '../views/authentication/RegisterDriver.vue'
import RegisterUser from '../views/authentication/RegisterUser.vue'
import Login from '../views/authentication/Login.vue'
import LoginDriver from '../views/authentication/LoginDriver.vue'
import LoginUser from '../views/authentication/LoginUser.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    children: [
      {
        path: 'driver',
        name: 'register-driver',
        component: RegisterDriver
      },
      {
        path: 'user',
        name: 'register-user',
        component: RegisterUser
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    children: [
      {
        path: 'driver',
        name: 'login-driver',
        component: LoginDriver
      },
      {
        path: 'user',
        name: 'login-user',
        component: LoginUser
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
