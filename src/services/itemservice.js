import Api from '@/services/api'

export default {
  fetchItems () {
    return Api().get('/api/items/findall')
  },
  fetchItem (id) {
    return Api().get(`/api/item/${id}`)
  }
}
