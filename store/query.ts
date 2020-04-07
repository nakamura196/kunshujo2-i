import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { QueryModel } from '~/models/QueryModel'

// stateFactory: true → Vuex をモジュールモードで扱うために指定
@Module({ stateFactory: true, namespaced: true, name: 'query' })
export default class Query extends VuexModule {
  query: QueryModel = {
    sort: '_score:desc',
    size: 20,

    after: '',
    before: '',
    id: [],
    image: [],
    keyword: [],
    advanced: {},

    currentPage: 1,
    layout: 'grid',
    col: 3,
    facetFlag: true,
    facetsFlag: {},
  }

  @Mutation
  init(): void {
    this.query.after = ''
    this.query.before = ''
    this.query.keyword = []
    this.query.id = []
    this.query.image = []
    this.query.advanced = {}

    const tmp: any = process.env.FACETS_FLAGS
    const flags: string[] = JSON.parse(tmp)
    for (let i = 0; i < flags.length; i++) {
      const field = flags[i]
      // 未設定の場合
      if (!this.query.facetsFlag[field]) {
        this.query.facetsFlag[field] = true
      }
    }
  }

  @Mutation
  setSort(value: string): void {
    this.query.sort = value
  }

  @Mutation
  setSize(value: number): void {
    this.query.size = value
  }

  @Mutation
  setAfter(value: string): void {
    this.query.after = value
  }

  @Mutation
  setBefore(value: string): void {
    this.query.before = value
  }

  @Mutation
  setFc(data: { [key: string]: any }): void {
    const label = data.label
    const values = data.values

    const advanced = this.query.advanced
    if (!advanced[label]) {
      advanced[label] = {
        '+': [],
        '-': [],
      }
    }
    const obj: any = advanced[label]

    for (let i = 0; i < values.length; i++) {
      const value: string = values[i]
      if (value.startsWith('-')) {
        obj['-'].push(value.slice(1))
      } else {
        obj['+'].push(value)
      }
    }
  }

  @Mutation
  removeFc(data: { [keyword: string]: any }): void {
    const label = data.label
    const values = data.values
    const advanced = this.query.advanced
    for (let i = 0; i < values.length; i++) {
      let value = values[i]
      let type = '+'
      if (value.startsWith('-')) {
        value = value.slice(1)
        type = '-'
      }
      const arr = advanced[label][type]
      advanced[label][type] = arr.filter((item: string) => item !== value)
    }
  }

  @Mutation
  setCurrentPage(value: number): void {
    this.query.currentPage = value
  }

  @Mutation
  setLayout(value: string): void {
    this.query.layout = value
  }

  @Mutation
  setCol(value: number): void {
    this.query.col = value
  }

  @Mutation
  setId(value: string[]): void {
    this.query.id = value
  }

  @Mutation
  removeId(value: string[]): void {
    const array = this.query.id
    const newArray: string[] = array.filter((n: string) => !value.includes(n))
    this.query.id = newArray
  }

  @Mutation
  setImage(value: string[]): void {
    this.query.image = value
  }

  @Mutation
  removeImage(value: string[]): void {
    const array = this.query.image
    const newArray: string[] = array.filter((n: string) => !value.includes(n))
    this.query.image = newArray
  }

  @Mutation
  setKeywords(value: string[]): void {
    this.query.keyword = value
  }

  @Mutation
  removeKeywords(value: string[]): void {
    const array = this.query.keyword
    const newArray: string[] = array.filter((n: string) => !value.includes(n))
    this.query.keyword = newArray
  }

  @Mutation
  setQuery(params: any): void {
    this.query.id = params.id ? convert2arr(params.id) : this.query.id
    this.query.after = params.after ? params.after : this.query.after
    this.query.before = params.before ? params.before : this.query.before
  }

  @Mutation
  setFacetFlag(value: boolean): void {
    this.query.facetFlag = value
  }

  @Mutation
  setFacetsFlag(data: { [keyword: string]: any }): void {
    this.query.facetsFlag[data.label] = data.value
  }
}

function convert2arr(value: any) {
  let values: string[] = []
  if (!Array.isArray(value)) {
    value = value.trim()
    if (value !== '') {
      values = [value]
    }
  } else {
    values = value
  }
  return values
}
