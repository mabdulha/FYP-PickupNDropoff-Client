import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/authentication/register/Register.vue'
import RegisterDriver from '../views/authentication/register/RegisterDriver'
import RegisterUser from '../views/authentication/register/RegisterUser.vue'
import Login from '../views/authentication/login/Login.vue'
import LoginDriver from '../views/authentication/login/LoginDriver.vue'
import LoginUser from '../views/authentication/login/LoginUser.vue'
import ItemView from '../views/ItemView.vue'
import PurchasedItemView from '../views/PurchasedItemView'
import UserItemView from '../views/UserItemView'
import DriversJobs from '../views/Deliveries'
import DriversCompletedJobs from '../views/CompletedDeliveries'

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
    path: '/view/item/:id/purchased',
    name: 'purchased-item-view',
    component: PurchasedItemView
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
  },
  {
    path: '/view/driver/jobs/completed',
    name: 'drivers-jobs-completed',
    component: DriversCompletedJobs
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
