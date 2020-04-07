<template>
  <div v-if="metadata._id">
    <div style="background-color: #f9f6f0;">
      <b-container class="py-3">
        <nuxt-link
          :to="localePath({ name: 'search' })"
          style="color: #ca4316;"
          >{{ $t('all_items') }}</nuxt-link
        >&nbsp;
        <span class="link-orange">
          > &nbsp;
        </span>
        <!-- eslint-disable-next-line vue/no-v-html -->
        {{ $utils.formatArrayValue(metadata._title) }}
      </b-container>
    </div>

    <b-container class="mt-3 mb-5">
      <iframe
        v-if="IIIF_VIEWER_SHOW_FLAG && manifest != null && manifest !== ''"
        :src="
          'https://universalviewer.io/examples/uv/./uv.html#?manifest=' +
          encodeURIComponent(
            manifest.startsWith('http://')
              ? 'https://api.cultural.jp/convert?u=' + manifest
              : manifest
          )
        "
        width="100%"
        :height="UV_HEIGHT"
        allowfullscreen
        frameborder="0"
      ></iframe>

      <b-row class="mt-5">
        <b-col sm="8">
          <h4>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <b>{{ $utils.formatArrayValue(metadata._title) }}</b>
          </h4>

          <dl class="row mt-4">
            <dt class="col-sm-2"></dt>
            <dd class="col-sm-10">
              <div
                v-if="!IIIF_VIEWER_SHOW_FLAG"
                style="
                  height: 150px;
                  display: flex;
                  background-color: lightgray;
                "
                class="mb-4"
              >
                <!-- <b-link v-bind:to="{ name: 'item', query: {'id' : value._id}}"> -->
                <b-img-lazy
                  :src="
                    metadata._image && metadata._image.length > 0
                      ? $utils.formatArrayValue(metadata._image)
                      : 'https://www.gumtree.com/static/1/resources/assets/rwd/images/orphans/a37b37d99e7cef805f354d47.noimage_thumbnail.png'
                  "
                  style="margin: auto; max-height: 100%; max-width: 100%;"
                ></b-img-lazy>
              </div>

              <!-- URL -->

              <a
                v-if="metadata._url && metadata._url.length > 0"
                target="_blank"
                :href="$utils.formatArrayValue(metadata._url)"
                class="btn btn-primary btn-blue my-2 mr-2"
              >
                {{ $t('view_full_item') }}
                <i class="fas fa-external-link-alt"></i>
              </a>

              <!-- RDF -->
              <template v-if="RDF_FLAG">
                <a
                  target="_blank"
                  :href="metadata.uri"
                  class="btn btn-primary btn-blue my-2 mx-2"
                >
                  {{ $t('view_rdf') }}
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </template>
            </dd>
          </dl>

          <template v-for="(obj, field) in metadata">
            <dl v-if="!field.startsWith('_')" :key="field" class="row mt-4">
              <dt class="col-sm-2 text-muted">{{ field }}</dt>
              <dd class="col-sm-10">
                <template v-if="FACETS_LABELS.includes(field)">
                  <nuxt-link
                    v-for="(value, index) in obj"
                    :key="index"
                    class="mr-2 link-orange"
                    :to="
                      localePath({
                        name: 'search',
                        query: $utils.createFacetQuery([
                          { field: 'fc-' + field, value: value },
                        ]),
                      })
                    "
                    >{{ value }}</nuxt-link
                  >
                </template>
                <template v-else>
                  <span
                    v-for="(value, index) in obj"
                    :key="index"
                    class="mr-2"
                    >{{ value }}</span
                  >
                </template>
              </dd>
            </dl>
          </template>

          <hr class="my-5" />

          <!-- URL -->

          <dl v-if="metadata._url && metadata._url.length > 0" class="row mt-2">
            <dt class="col-sm-2 text-muted">URL</dt>
            <dd class="col-sm-10">
              <a
                class="mr-2 link-orange"
                :href="$utils.formatArrayValue(metadata._url)"
                >{{ $utils.formatArrayValue(metadata._url) }}
                <i class="link-blue fas fa-external-link-alt"></i
              ></a>
            </dd>
          </dl>

          <dl
            v-if="metadata._media && metadata._media.length > 0"
            class="row mt-2"
          >
            <dt class="col-sm-2 text-muted">{{ $t('media') }}</dt>
            <dd class="col-sm-10">
              <nuxt-link
                v-for="(value, index) in metadata._media"
                :key="index"
                class="mr-2 link-orange"
                :to="
                  localePath({
                    name: 'search',
                    query: $utils.createFacetQuery([
                      { field: 'fc-_media', value: value },
                    ]),
                  })
                "
                >{{ value }}</nuxt-link
              >
            </dd>
          </dl>

          <!-- Rights -->

          <dl
            v-if="metadata._rights && metadata._rights.length > 0"
            class="row mt-2"
          >
            <dt class="col-sm-2 text-muted">{{ $t('rights') }}</dt>
            <dd class="col-sm-10">
              {{ $utils.formatArrayValue(metadata._rights) }}
            </dd>
          </dl>
        </b-col>

        <!-- 右パネル -->
        <b-col sm="4">
          <div
            v-if="manifest !== '' && IIIF_FLAG"
            class="px-3 py-3"
            style="background-color: #f9f6f0;"
          >
            <IIIFViewers :manifest="manifest" />
          </div>

          <div
            v-if="GOOGLE_FLAG"
            class="mt-4 px-3 py-3"
            style="background-color: #f9f6f0;"
          >
            <b-button
              v-if="$utils.formatArrayValue(metadata._image) !== ''"
              :href="
                'https://www.google.co.jp/searchbyimage?image_url=' +
                encodeURIComponent($utils.formatArrayValue(metadata._image))
              "
              target="_blank"
              block
              variant="primary"
              class="btn-blue"
            >
              {{ $t('google_image_search') }}
              <i class="fas fa-external-link-alt"></i>
            </b-button>
          </div>

          <div class="mt-4 px-3 py-3" style="background-color: #f9f6f0;">
            <share-buttons
              :id="itemId"
              :title="metadata._title"
              :url="url"
              class="mb-4"
            />
          </div>

          <div
            v-if="CITE_FLAG"
            class="mt-4 px-3 py-3"
            style="background-color: #f9f6f0;"
          >
            <Cite
              :source="$utils.formatArrayValue(metadata['attribution'])"
              :title="$utils.formatArrayValue(metadata['title'])"
              :url="url"
              class="mt-4"
            />
          </div>

          <!-- 
          <div
            v-if="$route.query.index"
            class="mt-4 px-3 py-3"
            style="background-color: #f9f6f0;"
          ></div>
          -->
          <NextPreviousItems :query="$route.query" class="mt-4 px-3 py-3" />
        </b-col>
      </b-row>

      <MoreLikeThis :item-id="itemId" />

      <SimilarImages v-if="SIMILAR_IMAGES_FLAG" :item-id="itemId" />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ShareButtons from '~/components/common/ShareButtons.vue'

import HorizontalItems from '~/components/display/HorizontalItems.vue'
import CardItem from '~/components/display/CardItem.vue'

import MoreLikeThis from '~/components/item/MoreLikeThis.vue'
import SimilarImages from '~/components/item/SimilarImages.vue'
import NextPreviousItems from '~/components/item/NextPreviousItems.vue'
import Cite from '~/components/item/Cite.vue'
import IIIFViewers from '~/components/item/IIIFViewers.vue'

@Component({
  components: {
    ShareButtons,
    HorizontalItems,
    CardItem,
    Cite,
    NextPreviousItems,
    MoreLikeThis,
    SimilarImages,
    IIIFViewers,
  },
})
export default class Item extends Vue {
  IIIF_VIEWER_SHOW_FLAG: boolean = true
  UV_HEIGHT = '600'
  CITE_FLAG = false
  SIMILAR_IMAGES_FLAG: boolean = process.env.SIMILAR_IMAGES_FLAG === 'true'
  PORTAL_FLAG = false
  RDF_FLAG = false

  GOOGLE_FLAG = false
  IIIF_FLAG = false

  rawApiResult: string = ''
  metadata: { [key: string]: string[] } = {}
  itemId: string = ''

  urlOfApi: string = ''
  manifest: string = ''

  apiResult: any = {}

  get url() {
    return process.env.BASE_URL + '/item/' + this.itemId
  }

  async asyncData(context: any) {
    const itemId = `${context.params.id}`

    const apiResult = await context.$axios
      .get(process.env.API_BASE_URL + '/item/' + itemId)
      .then((response: any) => {
        const apiResult = response.data
        return apiResult
      })
      .catch((error: any) => {
        // eslint-disable-next-line
        console.error(error)
      })

    let manifest = ''
    // manifestの登録
    if (apiResult._manifest && apiResult._manifest.length > 0) {
      manifest = apiResult._manifest[0]
    }

    return {
      apiResult,
      manifest,
      metadata: apiResult,
      itemId,
      urlOfApi: process.env.API_BASE_URL + '/item/' + itemId,
    }
  }

  head() {
    const apiResult = this.apiResult
    const title = this.$utils.formatArrayValue(apiResult._title)
    const description = this.$utils.formatArrayValue(apiResult.description)

    const image = this.$utils.formatArrayValue(apiResult._image)

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content:
            title +
            ' - ' +
            (this.$i18n.locale === 'ja'
              ? process.env.projectNameJa
              : process.env.projectNameEn),
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'article',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.url,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
    }
  }

  FACETS_LABELS: string[] = []

  mounted() {
    const tmp: any = process.env.FACETS_LABELS
    this.FACETS_LABELS = JSON.parse(tmp)
  }
}
</script>
