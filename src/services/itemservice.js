import Api from '@/services/api'

export default {
  fetchItems () {
    return Api().get('/api/items/findall')
  },
  fetchItem (id) {
    return Api().get(`/api/item/${id}`)
  },
  addItem (item) {
    return Api().post('/api/item/add', item,
      { headers: { 'Content-Type': 'application/json' } })
  },
  fetchItemsByUser (userID) {
    return Api().get(`/api/user/${userID}/items`)
  },
  updateItem (id, item) {
    return Api().put(`/api/item/update/${id}`, item,
      { headers: { 'Content-Type': 'application/json' } })
  },
  deleteItem (userID) {
    return Api().delete(`/api/item/delete/${userID}`)
  },
  upviewItem (id) {
    return Api().put(`/api/item/incrementview/${id}`)
  }
}
