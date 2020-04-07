<template>
  <div style="background-color: #639bb4;">
    <b-container>
      <b-row>
        <b-col
          sm="5"
          class="justify-content-center align-self-center my-sm-3 mt-3"
        >
          <nuxt-link :to="localePath({ name: 'index' })">
            <h3 class="text-white my-0">
              {{ $utils.getProjectName($i18n.locale) }}
            </h3>
          </nuxt-link>
        </b-col>
        <b-col sm="7" class="justify-content-center align-self-center my-3">
          <b-input-group>
            <b-form-input
              v-model="keywordStr"
              :placeholder="$t('add_a_search_term')"
              autocomplete="on"
              list="queryList"
              @keyup.enter="headerSearch()"
            ></b-form-input>
            <datalist id="queryList">
              <option v-for="(query, index) in queryList" :key="index">{{
                query
              }}</option>
            </datalist>

            <b-input-group-append>
              <b-button
                variant="primary"
                class="btn-blue"
                @click="headerSearch()"
                >{{ $t('search') }}</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from 'nuxt-property-decorator'

@Component
export default class Header extends Vue {
  keywordStr: string = ''
  keywords: string[] = []
  queryList: string[] = []

  // 保留。queryStoreを使いたい。
  @Watch('$route', { deep: true, immediate: true })
  watchRoute(val: any) {
    const keywords: any = val.query.keyword
    if (keywords) {
      this.keywords = this.$utils.convert2arr(keywords)
      this.keywordStr = this.$utils.formatArrayValue(this.keywords, ' ')
    } else {
      this.keywordStr = ''
    }
  }

  mounted() {
    // json が壊れている可能性があるので、その場合は local storage を削除
    if (localStorage.getItem('umesaoQuery')) {
      try {
        const queryList: any = localStorage.getItem('umesaoQuery')
        this.queryList = JSON.parse(queryList)
      } catch (e) {
        // eslint-disable-next-line
        console.error("Header no localStorage", e)
      }
    }
  }

  headerSearch() {
    const keywordStr = this.keywordStr

    // 検索履歴の保存
    if (keywordStr !== '') {
      let queryList = this.queryList
      if (!queryList.includes(keywordStr)) {
        queryList.unshift(keywordStr)
        queryList = queryList.slice(0, 10)
        this.queryList = queryList
        localStorage.setItem('umesaoQuery', JSON.stringify(queryList))
      }
    }

    const keywords = this.$utils.splitKeyword(keywordStr)

    // push 処理
    const query: any = Object.assign({}, this.$route.query)
    query.keyword = keywords
    query.from = 0

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }
}
</script>
