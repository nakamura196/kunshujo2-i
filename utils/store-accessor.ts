import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Query from '~/store/query'

// eslint-disable-next-line import/no-mutable-exports
let queryStore: Query

function initializeStores(store: Store<any>): void {
  queryStore = getModule(Query, store)
}

export { initializeStores, queryStore }
