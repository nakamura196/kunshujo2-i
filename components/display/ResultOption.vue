<template>
  <div>
    <nuxt-link
      v-if="SIMILAR_IMAGES_FLAG"
      :to="localePath({ name: 'search', query: { image: id } })"
      style="color: #ca4316;"
    >
      <i
        v-b-tooltip.hover
        :title="$t('similar_images')"
        style="cursor: pointer; font-size: 20px;"
        class="mdi mdi-image-search mx-2"
      ></i>
    </nuxt-link>

    <nuxt-link
      :to="localePath({ name: 'search', query: { id: id } })"
      style="color: #ca4316;"
    >
      <i
        v-b-tooltip.hover
        :title="$t('more_like_this')"
        style="cursor: pointer; font-size: 20px;"
        class="mdi mdi-magnify mx-2"
      ></i>
    </nuxt-link>

    <ShareButtons class="mx-2" :url="url" :title="title" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'
import ShareButtons from '~/components/common/ShareButtons.vue'

@Component({
  components: {
    ShareButtons,
  },
})
export default class resultoption extends Vue {
  SIMILAR_IMAGES_FLAG: boolean = process.env.SIMILAR_IMAGES_FLAG === 'true'

  @Prop({ required: true })
  id!: string

  @Prop({ required: true })
  title!: string

  @Prop({ required: true })
  path!: any

  get url() {
    return process.env.BASE_URL + '/item/' + this.id
  }
}
</script>
