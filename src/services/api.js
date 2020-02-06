import axios from 'axios'
const dotenv = require('dotenv')
dotenv.config()

export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_BASE_URL
  })
}
