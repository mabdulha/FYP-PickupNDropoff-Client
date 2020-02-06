import Api from '@/services/api'

export default {
  register (user) {
    return Api().post('/users/register', user,
      { headers: { 'Content-Type': 'application/json' } })
  }
}
