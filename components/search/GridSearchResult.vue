<template>
  <b-row>
    <b-col v-for="(value, index) in results" :key="index" :sm="col">
      <CardItem :item="$utils.item2CardItem(value, query, index)" />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'
import CardItem from '~/components/display/CardItem.vue'
import { queryStore } from '~/store'

@Component({
  components: {
    CardItem,
  },
})
export default class GridSearchResult extends Vue {
  get col() {
    const col: number = queryStore ? queryStore.query.col : 3
    return 12 / col
  }

  @Prop({
    required: true,
    default() {
      return []
    },
  })
  results!: any

  @Prop({
    default() {
      return {}
    },
  })
  query!: any
}
</script>
