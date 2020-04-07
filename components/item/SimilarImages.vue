<template>
  <div v-if="similarImagesData.length > 0">
    <hr class="my-5" />
    <b-row class="mb-4">
      <b-col sm="8"
        ><h3>{{ $t('similar_images') }}</h3></b-col
      >

      <b-col sm="4" class="text-right"
        ><nuxt-link
          class="link-orange"
          :to="
            localePath({
              name: 'search',
              query: { image: itemId },
            })
          "
        >
          {{ $t('show_more') }}
        </nuxt-link></b-col
      >
    </b-row>
    <HorizontalItems :data="similarImagesData" />
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
export default class similarimages extends Vue {
  similarImagesData: any[] = []

  @Prop({
    required: true,
  })
  itemId!: string

  mounted() {
    this.similarImages()
  }

  similarImages() {
    axios
      .get(process.env.API_BASE_URL + '/search?image=' + this.itemId)
      .then((response) => {
        const result = response.data
        if (result.err) {
          // eslint-disable-next-line
          console.error('similarImages', result)
          return
        }
        const hits = result.hits.hits
        for (let i = 0; i < hits.length; i++) {
          const obj = hits[i]
          this.similarImagesData.push(this.$utils.item2CardItem(obj))
        }
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.error('similarImages', err)
      })
  }
}
</script>
