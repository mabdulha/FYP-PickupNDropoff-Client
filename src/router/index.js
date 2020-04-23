import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import RegisterDriver from '../views/RegisterDriver'
import RegisterUser from '../views/RegisterUser.vue'
import Login from '../views/Login.vue'
import LoginDriver from '../views/LoginDriver.vue'
import LoginUser from '../views/LoginUser.vue'
import ItemView from '../views/ItemView.vue'
import UserItemView from '../views/UserItemView'
import DriversJobs from '../views/Deliveries'

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
  },
  {
    path: '/view/item/:id',
    name: 'item-view',
    component: ItemView
  },
  {
    path: '/view/items/my',
    name: 'user-item-view',
    component: UserItemView
  },
  {
    path: '/view/driver/jobs',
    name: 'drivers-jobs',
    component: DriversJobs
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
