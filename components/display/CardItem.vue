<template>
  <b-card
    no-body
    :style="
      horizontal
        ? 'width: ' + width + 'px; height: 300px; overflow-y: auto;'
        : ''
    "
    :class="horizontal ? 'mr-2' : 'mb-4'"
  >
    <div v-if="item.type && item.type != ''" class="px-3 py-3">
      <b-button
        variant="primary"
        class="btn-blue"
        size="sm"
        @click="removeItem(item.id, item.type)"
      >
        {{ item.type == 'image' ? $t('similar_images') : $t('more_like_this') }}
        <span aria-hidden="true">&times;</span>
      </b-button>
    </div>

    <nuxt-link
      :href="item.link ? item.link : ''"
      :to="item.path ? localePath(item.path) : ''"
      :target="item.link ? '_blank' : null"
    >
      <div style="height: 150px; display: flex; background-color: lightgray;">
        <b-img-lazy
          :src="
            item.image
              ? item.image
              : 'https://www.gumtree.com/static/1/resources/assets/rwd/images/orphans/a37b37d99e7cef805f354d47.noimage_thumbnail.png'
          "
          style="margin: auto; max-height: 100%; max-width: 100%;"
        ></b-img-lazy>
      </div>
    </nuxt-link>

    <b-card-body>
      <nuxt-link
        class="mr-2 link-orange"
        :href="item.link ? item.link : ''"
        :to="item.path ? localePath(item.path) : ''"
        :target="item.link ? '_blank' : null"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <b v-html="item.label"></b>
      </nuxt-link>

      <template v-if="item.description || item.detail">
        <template v-if="item.description">
          <br />
          {{ $utils.truncate(item.description, 25) }}
        </template>

        <template v-if="item.detail">
          <br />
          <a :href="item.detail" class="link-orange" target="_blank">
            {{ $t('detail') }}
            <i class="link-blue fas fa-external-link-alt"></i>
          </a>
        </template>
      </template>

      <!-- 

      <template v-if="item.source">
        <br />
        {{ item.source }}
      </template>

      -->

      <p class="text-right my-2">
        <ResultOption :id="item.id" :path="item.path" :title="item.label" />
      </p>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import ResultOption from '~/components/display/ResultOption.vue'
import { queryStore } from '~/store'

@Component({
  components: {
    ResultOption,
  },
})
export default class cardItem extends Vue {
  @Prop({
    default: 200,
  })
  width!: number

  @Prop({ required: true })
  item!: any

  @Prop({
    default: false,
  })
  horizontal!: boolean

  removeItem(id: string, type: string) {
    if (type === 'id') {
      queryStore.removeId([id])
    } else {
      queryStore.removeImage([id])
    }

    this.$router.push(
      this.localePath({
        name: 'search',
        query: this.$utils.getSearchQueryFromQueryStore(queryStore.query),
      }),
      () => {},
      () => {}
    )
  }
}
</script>
