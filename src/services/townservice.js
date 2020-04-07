import Api from '@/services/api'

export default {
  fetchCounties () {
    return Api().get('/api/counties/findall')
  },
  fetchTowns (county) {
    return Api().get(`/api/${county}/towns`)
  }
}
