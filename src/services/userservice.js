import Api from '@/services/api'

export default {
  fetchUser (id) {
    return Api().get(`/api/user/${id}`)
  }
}
