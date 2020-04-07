<template>
  <div v-if="moreLikeThisData.length > 0">
    <hr class="my-5" />
    <b-row class="mb-4">
      <b-col sm="8"
        ><h3>{{ $t('more_like_this') }}</h3></b-col
      >
      <b-col sm="4" class="text-right"
        ><nuxt-link
          class="link-orange"
          :to="localePath({ name: 'search', query: { id: itemId } })"
        >
          {{ $t('show_more') }}
        </nuxt-link></b-col
      >
    </b-row>
    <HorizontalItems :data="moreLikeThisData" />
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'nuxt-property-decorator'
import axios from 'axios'
import HorizontalItems from '~/components/display/HorizontalItems.vue'

@Component({
  components: {
    HorizontalItems,
  },
})
export default class morelikethis extends Vue {
  moreLikeThisData: any[] = []

  @Prop({
    required: true,
  })
  itemId!: string

  mounted() {
    this.moreLikeThis()
  }

  moreLikeThis() {
    axios
      .get(process.env.API_BASE_URL + '/search?id=' + this.itemId)
      .then((response) => {
        const result = response.data
        if (result.err) {
          // eslint-disable-next-line
          console.error('moreLikeThis', result)
          return
        }
        const hits = result.hits.hits
        for (let i = 0; i < hits.length; i++) {
          const obj = hits[i]
          this.moreLikeThisData.push(this.$utils.item2CardItem(obj))
        }
      })
  }
}
</script>
