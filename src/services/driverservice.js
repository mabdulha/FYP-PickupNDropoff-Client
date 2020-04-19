import Api from '@/services/api'

export default {
  fetchDriver (id) {
    return Api().get(`/api/driver/${id}`)
  },
  fetchItemsForDeliver (town) {
    return Api().get(`/api/items/find/${town}/fordelivery`)
  },
  fetchDriverJobs (id) {
    return Api().get(`/api/driver/${id}/deliveries`)
  }
}
