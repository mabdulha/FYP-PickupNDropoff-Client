import Api from '@/services/api'

export default {
  fetchDriver (id) {
    return Api().get(`/api/driver/${id}`)
  }
}
