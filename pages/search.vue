<template>
  <div>
    <div class="mb-0 py-3" style="background-color: #f9f6f0;">
      <AdvancedSearchOptions />

      <b-container>
        <b-row>
          <b-col sm="5">
            <h3 class="justify-content-center align-self-center my-3">
              {{ total.toLocaleString() }}{{ $t('hits') }}
            </h3>
          </b-col>
          <b-col sm="7">
            <b-row>
              <b-col sm="3">
                {{ $t('sort_by') }}
                <b-form-select
                  id="inline-form-custom-select-pref"
                  v-model="sort"
                  class="mb-2 mr-sm-2 mb-sm-0 mt-2"
                  :options="computedItemsSort"
                  @change="setSort"
                ></b-form-select>
              </b-col>
              <b-col sm="3">
                {{ $t('items_per_page') }}
                <b-form-select
                  id="inline-form-custom-select-pref"
                  v-model="size"
                  class="mb-2 mr-sm-2 mb-sm-0 mt-2"
                  :options="[
                    { value: 20, text: '20' },
                    { value: 50, text: '50' },
                    { value: 100, text: '100' },
                  ]"
                  @change="setSize"
                ></b-form-select>
              </b-col>
              <b-col sm="3">
                {{ $t('layout') }}
                <br />
                <div class="btn-group-toggle btn-group mt-2 ml-2 mb-2">
                  <label
                    v-for="(layoutOption, index) in layoutOptions"
                    :key="index"
                    class="btn btn-light"
                    :class="[
                      layoutOption.value === storedQuery.layout ? 'active' : '',
                    ]"
                  >
                    <input
                      v-model="layout"
                      type="radio"
                      autocomplete="off"
                      :value="layoutOption.value"
                    />
                    <i :class="layoutOption.class"></i>
                  </label>
                </div>
              </b-col>
              <b-col v-if="layout === 'grid'" sm="3">
                {{ $t('col') }}
                <b-form-select
                  id="inline-form-custom-select-pref"
                  v-model="col"
                  class="mb-2 mr-sm-2 mb-sm-0 mt-2"
                  :options="[
                    { value: 3, text: '3' },
                    { value: 4, text: '4' },
                    { value: 6, text: '6' },
                    { value: 12, text: '12' },
                  ]"
                  @change="setCol"
                ></b-form-select>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>

      <SearchFilter />
    </div>

    <b-container>
      <b-row class="mb-5 mt-5">
        <b-col :sm="facetFlag ? 8 : 12" order-sm="2" class="mb-5">
          <h3 class="mb-4">
            <i
              v-if="!facetFlag"
              v-b-tooltip.hover
              style="cursor: pointer;"
              :title="$t('open_facets')"
              class="fas fa-bars mr-2"
              @click="setFacetFlag(!facetFlag)"
            ></i>
            <span>{{ $t('search_result') }}</span>
          </h3>
          <SearchResult
            v-if="results.hits"
            :results="results.hits.hits"
            :query="$route.query"
          />

          <!-- 重要。検索結果が0の時に非表示にできる v-model="query.currentPage" -->
          <b-pagination
            v-if="total > 0"
            v-model="currentPage"
            :total-rows="total"
            :per-page="storedQuery.size"
            aria-controls="my-table"
            align="right"
            class="mt-5"
            @input="setCurrentPage"
          ></b-pagination>

          <!-------- 終了 -------->
        </b-col>

        <b-col v-show="facetFlag" :sm="4" order-sm="1">
          <h3 class="mb-4">
            <i
              v-if="facetFlag"
              v-b-tooltip.hover
              style="cursor: pointer;"
              :title="$t('close_facets')"
              class="fas fa-bars mr-2"
              @click="setFacetFlag(!facetFlag)"
            ></i>
            {{ $t('refine_your_search') }}
          </h3>

          <FacetSearchOptions
            v-if="results.aggregations"
            :aggregations="results.aggregations"
            :facet-labels="facetLabels"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import SearchFilter from '~/components/search/filter.vue'
import AdvancedSearchOptions from '~/components/search/AdvancedSearchOptions.vue'
import FacetSearchOptions from '~/components/search/FacetSearchOptions.vue'
import SearchResult from '~/components/search/SearchResult.vue'

import { queryStore } from '~/store'

const SORT_LABELS: any = process.env.SORT_LABELS
const FACETS_LABELS: any = process.env.FACETS_LABELS

@Component({
  components: {
    SearchFilter,
    AdvancedSearchOptions,
    FacetSearchOptions,
    SearchResult,
  },
  watchQuery: true,
})
export default class Search extends Vue {
  // 変数

  // ソート項目
  itemsSort: string[] = JSON.parse(SORT_LABELS)

  // 表示切り替え
  layoutOptions: any[] = [
    {
      class: 'fas fa-th-large',
      value: 'grid',
    },
    {
      class: 'fas fa-th-list',
      value: 'list',
    },
  ]

  // ファセット項目
  facetLabels: string[] = JSON.parse(FACETS_LABELS)

  // 検索結果
  results: any = {}

  currentPage: number = 1 // this.query.currentPage

  layout: string = '' // this.query.layout

  col: number = -1 // this.query.col

  size: number = -1 // this.query.size

  sort: string = '' // this.query.sort

  storedQuery: any = {}

  data: any = {
    sort: -1,
  }

  async asyncData(context: any) {
    const url = process.env.API_BASE_URL + '/search'
    const results = await context.$axios
      .get(url, {
        params: context.query,
      })
      .then((res: any) => {
        return res.data
      })
      .catch((error: any) => {
        return error
      })

    return {
      results,
    }
  }

  head() {
    return {
      title: this.$t('search'),
    }
  }

  created() {
    if (queryStore) {
      // eslint-disable-next-line
      console.log('queryStore.query', queryStore.query)
    } else {
      // eslint-disable-next-line
      console.log('queryStore','null')
    }

    // 初期化
    queryStore.init()

    const storedQuery = queryStore.query
    this.storedQuery = storedQuery

    const routeQuery: any = this.$route.query

    const sort: string = routeQuery.sort
    if (sort) {
      queryStore.setSort(sort)
    }
    this.sort = storedQuery.sort
    this.data.sort = storedQuery.sort

    const size: string = routeQuery.size
    if (size) {
      const numberedSize: number = Number(size)
      queryStore.setSize(numberedSize)
    }
    this.size = storedQuery.size

    const from: string = routeQuery.from
    if (from) {
      this.currentPage = Number(from) / Number(this.size) + 1
    }
    this.currentPage = storedQuery.currentPage

    // 非クエリ

    this.layout = storedQuery.layout
    this.col = storedQuery.col

    // 以下クエリ

    const id: string = routeQuery.id
    if (id) {
      queryStore.setId(this.$utils.convert2arr(id))
    }

    const image: string = routeQuery.image
    if (image) {
      queryStore.setImage(this.$utils.convert2arr(image))
    }

    const keywords: any = routeQuery.keyword
    if (keywords) {
      queryStore.setKeywords(this.$utils.convert2arr(keywords))
    }

    for (const key in routeQuery) {
      if (key.includes('fc-')) {
        queryStore.setFc({
          label: key,
          values: this.$utils.convert2arr(routeQuery[key]),
        })
      }
    }

    // eslint-disable-next-line
    console.log('check.sort', this.sort)

    // eslint-disable-next-line
    console.log('check.data', this.data)
  }

  // ------ Watch -------

  @Watch('layout')
  watchLayout(currentValue: any) {
    queryStore.setLayout(currentValue)
  }

  // ------ 関数 -------

  setCurrentPage() {
    if (this.currentPage > 0) {
      const query: any = Object.assign({}, this.$route.query)
      query.from = (this.currentPage - 1) * this.size
      this.updateQuery(query)
    }
  }

  setCol() {
    queryStore.setCol(this.col)
  }

  setSize() {
    const query: any = Object.assign({}, this.$route.query)
    query.from = 0
    query.size = this.size
    this.updateQuery(query)
  }

  setSort() {
    const query: any = Object.assign({}, this.$route.query)
    query.from = 0
    query.sort = this.sort
    this.updateQuery(query)
  }

  updateQuery(query: any) {
    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }

  setFacetFlag() {
    queryStore.setFacetFlag(!this.facetFlag)
  }

  // ------ Computed --------

  get facetFlag(): boolean {
    return this.storedQuery.facetFlag
  }

  get total() {
    return this.results.hits ? this.results.hits.total.value : 0
  }

  get computedItemsSort() {
    const arr: any[] = [
      {
        value: '_score:desc',
        text: this.$t('relevance'),
      },
    ]

    const orders = ['asc', 'desc']

    const itemsSort = this.itemsSort

    for (let i = 0; i < itemsSort.length; i++) {
      const value = itemsSort[i]
      for (let j = 0; j < orders.length; j++) {
        const order = orders[j]
        const label = value.startsWith('_') ? this.$t(value.slice(1)) : value
        arr.push({
          value: value + '.keyword:' + order,
          text: label + ' ' + this.$t(order),
        })
      }
    }

    return arr
  }
}
</script>
