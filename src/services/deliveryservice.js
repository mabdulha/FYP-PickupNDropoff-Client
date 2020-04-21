import Api from '@/services/api'

export default {
  addDelivery (delivery) {
    return Api().post('/api/delivery/add', delivery,
      { headers: { 'Content-Type': 'application/json' } })
  },
  updateDelivery (id, delivery) {
    return Api().put(`/api/delivery/update/${id}`, delivery,
      { headers: { 'Content-Type': 'application/json' } })
  }
}
