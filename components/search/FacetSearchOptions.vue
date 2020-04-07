<template>
  <div>
    <!-- facets -->
    <template v-for="(label, index) in facetLabels">
      <FacetOption
        v-if="aggregations[label]"
        :key="index"
        :label="label"
        :buckets="aggregations[label].buckets"
        :query="query"
      />
    </template>

    <DateFacet v-if="dateFacetFlag" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop /*, Emit */, Component } from 'nuxt-property-decorator'
import FacetOption from '~/components/search/FacetOption.vue'
import DateFacet from '~/components/search/DateFacet.vue'
import { queryStore } from '~/store'

@Component({
  components: {
    FacetOption,
    DateFacet,
  },
})
export default class searchoptions extends Vue {
  // とりあえず非表示
  dateFacetFlag: boolean = false

  @Prop({
    default() {
      return {}
    },
  })
  aggregations!: any

  @Prop({
    default() {
      return []
    },
  })
  facetLabels!: string[]

  query: any = queryStore ? queryStore.query : null
}
</script>
