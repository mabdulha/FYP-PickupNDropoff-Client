import Api from '@/services/api'

export default {
  register (user) {
    return Api().post('/api/users/register', user,
      { headers: { 'Content-Type': 'application/json' } })
  },
  login (credentials) {
    return Api().post('/api/users/login', credentials)
  }
}
