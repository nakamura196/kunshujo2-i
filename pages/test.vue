<template>
  <b-container class="my-5">
    <hr />
    <div v-for="(obj, index) in data" :key="index">
      <b-row>
        <b-col :sm="2">{{ index }}</b-col>
        <b-col :sm="10">{{ obj }}</b-col>
      </b-row>
      <hr />
    </div>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Search extends Vue {
  data: any = {}

  async asyncData(context: any) {
    const urls: string[] = [
      process.env.API_BASE_URL + '/search',
      'https://api-dev-umesao.cultural.jp/search',
      'https://2s6wstaqid.execute-api.us-east-1.amazonaws.com/dev/api/search',
      'https://api-dev.cultural.jp/search',
      'https://api-dev-umesao.cultural.jp',
      process.env.API_BASE_URL + '/',
    ]

    const data: any = {}

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      const results = await context.$axios
        .get(url, {
          params: context.query,
        })
        .then((res: any) => {
          return res.data
        })
        .catch((error: any) => {
          return error
        })
      data[url] = results
    }

    return {
      data,
    }
  }
}
</script>
