<template>
  <b-row>
    <b-col v-for="(obj, index) in list" :key="index" :sm="12 / col">
      <b-card no-body class="mb-4">
        <nuxt-link :to="localePath(obj.path)">
          <div
            style="height: 150px; display: flex; background-color: lightgray;"
          >
            <b-img-lazy
              :src="obj.image"
              style="margin: auto; max-height: 100%; max-width: 100%;"
            ></b-img-lazy>
          </div>
        </nuxt-link>
        <b-card-body>
          <nuxt-link :to="localePath(obj.path)" style="color: #ca4316;">
            {{ obj.label }}
          </nuxt-link>

          <b-card-text>
            {{ obj.description }}
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class grid extends Vue {
  @Prop({ default: 4 })
  col!: number

  @Prop({ default: [] })
  list!: any[]
}
</script>
