<template>
  <b-row>
    <b-col sm="5" class="mb-4">
      <nuxt-link class="mb-4" :to="localePath(item.path)">
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
    </b-col>
    <b-col sm="7">
      <h5>
        <nuxt-link :to="localePath(item.path)" style="color: #ca4316;">
          {{ item.label }}
        </nuxt-link>
      </h5>

      <div class="text-muted">
        <template v-if="item.manifest">
          <b-link :href="item.manifest" target="_blank" classs="mr-2">
            <img
              width="30px"
              src="https://pbs.twimg.com/profile_images/596366309601845248/2uaPY5NH_400x400.png"
            />
          </b-link>
        </template>
        <!-- 
        <template v-if="value._source['temporal_' + $i18n.locale].length > 0">
          {{
            $utils.formatArrayValue(value._source['temporal_' + $i18n.locale])
          }}
          ·
        </template>
        <template v-if="value._source['agential_' + $i18n.locale].length > 0">
          {{
            $utils.formatArrayValue(value._source['agential_' + $i18n.locale])
          }}
          ·
        </template>
        {{ $utils.formatArrayValue(value._source['access_' + $i18n.locale]) }}
        -->
      </div>

      <template v-if="item.description">
        {{ $utils.truncate(item.description, 25) }}
      </template>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'

@Component
export default class ListItem extends Vue {
  @Prop()
  item!: any
}
</script>
