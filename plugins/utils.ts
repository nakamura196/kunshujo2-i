// /plugins/logger.ts
export class Utils {
  formatArrayValue(arr: string[], delimiter: string = ', '): any {
    if (arr == null) {
      return ''
    }
    if (arr.length === 1) {
      return arr[0]
    } else {
      const value: string = arr.join(delimiter)
      return value
    }
  }

  indexedQuery(query: any, index: number): any {
    const obj: any = {}
    for (const key in query) {
      obj[key] = query[key]
    }
    const from = query.from ? query.from : 0
    obj.index = index + Number(from)
    return obj
  }

  item2CardItem(
    item: any,
    query: any = null,
    index: number = -1,
    type: string = ''
  ) {
    const _source = item._source

    const id = item._id

    const path: any = {
      name: 'item-id',
      params: {
        id,
      },
    }

    if (query !== null) {
      path.query = this.indexedQuery(query, index)
    }

    const cardItem: any = {
      path,
      label: this.formatArrayValue(_source._title),
      id,
      url: this.formatArrayValue(_source._url),
    }

    if (_source._image) {
      cardItem.image = this.formatArrayValue(_source._image)
    }

    if (_source._manifest) {
      cardItem.manifest = this.formatArrayValue(_source._manifest)
    }

    if (type) {
      cardItem.type = type
    }

    return cardItem
  }

  getProjectFooter(lang: string) {
    const value =
      lang === 'ja' ? process.env.projectFooterJa : process.env.projectFooterEn
    return value
  }

  getProjectName(lang: string) {
    const value =
      lang === 'ja' ? process.env.projectNameJa : process.env.projectNameEn
    return value
  }

  getProjectDescription(lang: string) {
    const value =
      lang === 'ja'
        ? process.env.projectDescriptionJa
        : process.env.projectDescriptionEn
    return value
  }

  splitKeyword(keyword: string): string[] {
    // 全角を半角に変換
    // 空の配列を削除
    // eslint-disable-next-line
    return keyword.replace(/　/g, ' ').split(' ').filter(item => item !== "")
  }

  createFacetQuery(arr: any[]): { [key: string]: string } {
    const result: { [key: string]: string } = {}
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i]
      result[obj.field] = obj.value
    }
    return result
  }

  truncate(str: string, length: number): string {
    return str.length <= length ? str : str.substr(0, length) + '...'
  }

  convert2arr(value: any) {
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

  getSearchQueryFromQueryStore(query: any): any {
    const params: any = {
      sort: query.sort,
      size: query.size,
      from: (query.currentPage - 1) * query.size,
    }

    if (query.before !== '') {
      params.before = query.before
    }

    if (query.after !== '') {
      params.after = query.after
    }

    if (query.keyword.length > 0) {
      params.keyword = query.keyword
    }

    if (query.id.length > 0) {
      params.id = query.id
    }

    if (query.image.length > 0) {
      params.image = query.image
    }

    const advanced = query.advanced
    for (const key in advanced) {
      const values = []
      const obj = advanced[key]
      for (const type in obj) {
        const arr = obj[type]
        for (let i = 0; i < arr.length; i++) {
          const value = arr[i]
          values.push(type === '+' ? value : '-' + value)
        }
      }
      params[key] = values
    }

    // params.after = query.after ? query.after : null
    // params.before = query.before ? query.before : null
    // params.id = query.id ? query.id : null

    return params
  }
}

export default (_: any, inject: any) => {
  inject('utils', new Utils())
}
