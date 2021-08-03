import Vue from 'vue'
import { listDictDetails } from '@/api/dict'

export default class Dict {
  constructor(dict) {
    this.dict = dict
  }

  async init(names, completeCallback) {
    if (names === undefined || names === null) {
      throw new Error('need Dict names')
    }
    const ps = []
    names.forEach(n => {
      Vue.set(this.dict.dict, n, {})
      Vue.set(this.dict.label, n, {})
      Vue.set(this.dict, n, [])
      ps.push(listDictDetails(n).then(resp => {
        console.log('dict resp: %o', resp.data)
        this.dict[n].splice(0, 0, ...resp.data.details)
        resp.data.details.forEach(d => {
          Vue.set(this.dict.dict[n], d.value, d)
          Vue.set(this.dict.label[n], d.value, d.label)
        })
      }))
    })
    await Promise.all(ps)
    completeCallback()
  }
}
