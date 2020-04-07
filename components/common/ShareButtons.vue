<template>
  <span>
    <i
      :id="id"
      style="cursor: pointer; font-size: 20px;"
      class="mdi mdi-share-variant"
    ></i>
    <b-popover :target="id" triggers="hover" placement="top">
      <a
        class="mx-2 link-blue"
        :href="twitterUrl"
        target="_blank"
        title="Twitterで共有"
      >
        <i class="mdi mdi-twitter" style="font-size: 30px;" />
      </a>

      <a
        class="mx-2 link-blue"
        :href="facebookUrl"
        target="_blank"
        title="Facebookで共有"
      >
        <i class="mdi mdi-facebook" style="font-size: 30px;" />
      </a>

      <a
        class="mx-2 link-blue"
        :href="pocketUrl"
        target="_blank"
        title="pocketで共有"
      >
        <i class="mdi mdi-pocket" style="font-size: 30px;" />
      </a>
    </b-popover>
  </span>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ShareButtons extends Vue {
  @Prop({ required: true })
  url!: string

  @Prop({ required: true })
  title!: string

  get twitterUrl() {
    return (
      'https://twitter.com/intent/tweet?url=' + this.url + '&text=' + this.title
    )
  }

  get facebookUrl() {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + this.url
  }

  get pocketUrl() {
    return 'http://getpocket.com/edit?url=' + this.url
  }

  get id() {
    return Buffer.from(this.url).toString('base64')
  }
}
</script>
