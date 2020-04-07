<template>
  <div v-show="filterShowFlag">
    <hr />
    <b-container>
      <span class="mr-2">{{ $t('filter') }}</span>

      <template v-if="query.keyword">
        <b-button
          v-for="(keyword, index) in query.keyword"
          :key="index"
          variant="primary"
          class="m-1 btn-blue"
          size="sm"
          @click="removeKeyword(keyword)"
        >
          <span>{{ $t('keyword') }}: </span>
          <b class="mr-2">{{ keyword }}</b>
          <span aria-hidden="true">&times;</span>
        </b-button>
      </template>

      <template v-for="(agg, label) in query.advanced">
        <span :key="label">
          <template v-for="key in ['+', '-']">
            <b-button
              v-for="(value, index2) in agg[key]"
              :key="index2"
              variant="primary"
              class="m-1 btn-blue"
              size="sm"
              @click="removeFc(label, [key === '+' ? value : '-' + value])"
            >
              {{ label }}:
              <b class="mr-2">
                {{ key === '+' ? value : '-' + value }}
              </b>
              <span aria-hidden="true">&times;</span>
            </b-button>
          </template>
        </span>
      </template>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { queryStore } from '~/store'

@Component
export default class searchfilter extends Vue {
  query: any = queryStore.query
  // query: any = this.$route.query

  removeKeyword(value: string) {
    queryStore.removeKeywords([value])
    this.$router.push(
      this.localePath({
        name: 'search',
        query: this.$utils.getSearchQueryFromQueryStore(queryStore.query),
      }),
      () => {},
      () => {}
    )
  }

  removeFc(label: string, values: string[]) {
    queryStore.removeFc({
      label,
      values,
    })

    // push 処理
    const query: any = this.$utils.getSearchQueryFromQueryStore(
      queryStore.query
    )

    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }

  get filterShowFlag(): boolean {
    let flag = false
    const query = this.query
    if (query.keyword.length > 0 || Object.keys(query.advanced).length > 0) {
      flag = true
    }
    return flag
  }
}
</script>
