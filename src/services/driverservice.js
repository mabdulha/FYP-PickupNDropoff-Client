import Api from '@/services/api'

export default {
  fetchDriver (id) {
    return Api().get(`/api/driver/${id}`)
  },
  fetchItemsForDeliver (town) {
    return Api().get(`/api/deliveries/find/${town}`)
  },
  fetchDriverJobs (id) {
    return Api().get(`/api/driver/${id}/deliveries`)
  },
  fetchDriverCompletedJobs (id) {
    return Api().get(`/api/driver/${id}/deliveries/completed`)
  }
}
