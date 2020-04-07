<template>
  <div>
    <dl>
      <dt class="text-muted">Manifest URI icon &amp; IIIF viewers</dt>
      <dd>
        <b-button :href="manifest" target="_blank" variant="link">
          <img
            width="30px"
            src="https://pbs.twimg.com/profile_images/596366309601845248/2uaPY5NH_400x400.png"
          />
        </b-button>
        <b-button
          v-for="(obj, index) in viewers"
          :key="index"
          target="_blank"
          :href="obj.url + encodeURIComponent(manifest)"
          variant="link"
        >
          <img width="30px" :src="obj.image" />
        </b-button>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'nuxt-property-decorator'

@Component
export default class ShareButtons extends Vue {
  @Prop({ required: true })
  manifest!: string

  viewers: { [key: string]: string }[] = [
    {
      image: 'https://iiif.dl.itc.u-tokyo.ac.jp/images/mirador.png',
      url: 'http://iiif.cultural.jp/mirador/index.html?manifest=',
    },
    {
      image: 'https://iiif.dl.itc.u-tokyo.ac.jp/images/uv.png',
      url: 'http://universalviewer.io/examples/uv/uv.html#?manifest=',
    },
    {
      image: 'https://www.kanzaki.com/parts/me128b.png',
      url: 'http://www.kanzaki.com/works/2016/pub/image-annotator?u=',
    },
    {
      image: 'https://iiif.dl.itc.u-tokyo.ac.jp/images/icp.png',
      url:
        'http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest=',
    },
    /*,
    {
      image: 'https://avatars2.githubusercontent.com/u/31309906',
      url: 'http://tify.sub.uni-goettingen.de/demo.html?manifest='
    }
    */
  ]
}
</script>
