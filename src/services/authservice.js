import Api from '@/services/api'

export default {
  registerUser (user) {
    return Api().post('/api/users/register', user,
      { headers: { 'Content-Type': 'application/json' } })
  },
  loginUser (credentials) {
    return Api().post('/api/users/login', credentials)
  },
  registerDriver (driver) {
    return Api().post('/api/drivers/register', driver,
      { headers: { 'Content-Type': 'application/json' } })
  },
  loginDriver (credentials) {
    return Api().post('/api/drivers/login', credentials)
  }
}
