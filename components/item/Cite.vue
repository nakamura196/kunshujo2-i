<template>
  <div>
    <b-button
      block
      variant="primary"
      class="btn-orange"
      @click="flagCitation = !flagCitation"
      >{{ $t('cite_this_item') }}</b-button
    >
    <div
      v-show="flagCitation"
      style="background-color: #f9f6f0;"
      class="p-2 mt-2 mt-4"
    >
      <p class="mt-2 mb-1">
        <b>Chicago citation style</b>
      </p>
      <b-card no-body>
        <b-card-body>
          <b-card-text>
            {{ title }}. Retrieved from {{ source }}, {{ url }}. (Accessed
            {{ new Date() | formatDate }}.)
          </b-card-text>
        </b-card-body>
      </b-card>
      <p class="mt-2 mb-1">
        <b>APA citation style</b>
      </p>
      <b-card no-body>
        <b-card-body>
          <b-card-text>
            {{ title }}. Retrieved from {{ source }},
            {{ url }}
          </b-card-text>
        </b-card-body>
      </b-card>

      <p class="mt-2 mb-1">
        <b>MLA citation style</b>
      </p>
      <b-card no-body>
        <b-card-body>
          <b-card-text>
            Retrieved from {{ source }}, &lt;{{ url }}&gt;.
          </b-card-text>
        </b-card-body>
      </b-card>
      <p class="my-2">
        <small>
          <b>Note:</b> These citations are programmatically generated and may be
          incomplete.
        </small>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Prop, Component, Vue } from 'nuxt-property-decorator'

@Component({
  // filters
  filters: {
    formatDate(date: any): string {
      return moment(date).format('YYYY-MM-DD')
    },
  },
})
export default class ShareButtons extends Vue {
  flagCitation: boolean = false

  @Prop({ required: true })
  url!: string

  @Prop({ required: true })
  title!: string

  @Prop({ required: true })
  source!: string
}
</script>
