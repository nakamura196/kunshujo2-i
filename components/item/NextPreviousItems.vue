<template>
  <div>
    <b-button
      v-show="npItems.next != null || npItems.previous != null"
      block
      variant="primary"
      class="btn-orange"
      @click="showFlag = !showFlag"
      >{{ $t('show_next/previous_item') }}</b-button
    >
    <div v-show="showFlag" class="mt-4">
      <template v-for="(item, index) in npItems">
        <template v-if="item != null" class="mb-4">
          <b :key="'key_' + index" class="text-muted">{{ $t(index) }}</b>
          <CardItem :key="'value_' + index" class="mt-2 mb-4" :item="item" />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'nuxt-property-decorator'
import axios from 'axios'
import CardItem from '~/components/display/CardItem.vue'

@Component({
  components: {
    CardItem,
  },
})
export default class npitems extends Vue {
  showFlag: boolean = false

  npItems: any = {
    next: null,
    previous: null,
  }

  @Prop({
    default() {
      return {}
    },
    required: true,
  })
  query!: any

  mounted() {
    this.findItems()
  }

  findItems() {
    const directions: string[] = ['next', 'previous']
    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i]

      const baseQuery = this.query
      const index = Number(baseQuery.index)
      let from: number
      if (direction === 'next') {
        from = index + 1
      } else {
        from = index - 1
      }

      if (from < 0) {
        return
      }

      const pathQuery: { [key: string]: any } = {}
      const findQuery: { [key: string]: any } = {}
      for (const key in baseQuery) {
        pathQuery[key] = baseQuery[key]
        findQuery[key] = baseQuery[key]
      }

      pathQuery.index = from

      findQuery.from = from
      findQuery.size = 1

      axios
        .get(process.env.API_BASE_URL + '/search', { params: findQuery })
        .then((response) => {
          if (response.data.err) {
            return
          }
          const result = response.data.hits.hits
          if (result.length > 0) {
            const obj = result[0]
            this.npItems[direction] = this.$utils.item2CardItem(
              obj,
              this.query,
              from,
              ''
            )
          }
        })
    }
  }
}
</script>
