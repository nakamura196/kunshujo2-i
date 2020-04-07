<template>
  <div v-if="items.length > 0">
    <b-container>
      <b-row>
        <b-col :sm="3">
          <h3 class="mt-4">{{ $t('query_item') }}</h3>
        </b-col>
        <b-col :sm="9">
          <HorizontalItems :data="items" :width="300" />
        </b-col>
      </b-row>
    </b-container>
    <hr />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import axios from 'axios'
import HorizontalItems from '~/components/display/HorizontalItems.vue'
import { queryStore } from '~/store'

@Component({
  components: {
    HorizontalItems,
  },
})
export default class AdvancedSearchOptions extends Vue {
  items: any[] = []

  // なぞ。ajaxはしょうがない？
  @Watch('$route', { deep: true, immediate: true })
  watchRoute() {
    this.items = []
    this.main()
  }

  main() {
    const query: any = queryStore.query
    // eslint-disable-next-line
    console.log('main.query', query)
    const arr: string[] = ['image', 'id']
    for (let i = 0; i < arr.length; i++) {
      const key = arr[i]
      if (query[key] && query[key].length > 0) {
        const ids: string[] = this.$utils.convert2arr(query[key])
        for (let j = 0; j < ids.length; j++) {
          const id: string = ids[j]
          this.search4id(id, key)
        }
      }
    }
  }

  search4id(id: string, key: string) {
    const url = process.env.API_BASE_URL + '/item/' + id
    axios
      .get(url)
      .then((res) => {
        const item = this.$utils.item2CardItem(
          {
            _id: res.data._id,
            _source: res.data,
          },
          null,
          -1,
          key
        )
        this.items.push(item)
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error('search4id', error)
      })
  }
}
</script>
