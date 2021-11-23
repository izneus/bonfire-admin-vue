import Vue from 'vue'
import { listDictsByDictType } from '@/api/dict'

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
      ps.push(listDictsByDictType(n).then(resp => {
        this.dict[n].splice(0, 0, ...resp.data.details)
        resp.data.details.forEach(d => {
          Vue.set(this.dict.dict[n], d.dictValue, d)
          Vue.set(this.dict.label[n], d.dictValue, d.dictLabel)
        })
      }))
    })
    await Promise.all(ps)
    completeCallback()
  }
}
