<template>
  <div>
    <div class="mb-0" style="background-color: #f9f6f0;">
      <b-container class="py-4">
        <h1>{{ $t('about_') }}</h1>
      </b-container>
    </div>
    <b-container class="my-5">
      ほげほげ
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class AboutPage extends Vue {
  head() {
    return {
      title: this.$t('about_'),
    }
  }

  mounted() {
    // eslint-disable-next-line
    console.log("CDN_URL", process.env.CDN_URL)
    // eslint-disable-next-line
    console.log("API_BASE_URL", process.env.API_BASE_URL)
    // eslint-disable-next-line
    console.log("BASE_URL", process.env.BASE_URL)
  }
}
</script>
