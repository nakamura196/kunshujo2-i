<template>
  <b-list-group
    v-if="buckets.length > 0 || getArray('-').length > 0"
    class="mb-4"
  >
    <b-list-group-item style="background-color: #f9f6f0;">
      <div class="row">
        <div class="col-8">
          <h5 class="my-0">
            {{ label.startsWith('_') ? $t(label.slice(1)) : label }}
          </h5>
        </div>
        <div class="col-4 text-right">
          <i
            style="cursor: pointer;"
            :class="openFlag ? 'fas fa-minus' : 'fas fa-plus'"
            @click="setFacetsFlag"
          >
          </i>
        </div>
      </div>
    </b-list-group-item>
    <template v-if="openFlag">
      <b-list-group-item
        v-if="buckets.length > 0"
        :key="label + '_value'"
        style="background-color: #f9f6f0;"
      >
        <div style="max-height: 400px; overflow-y: auto; overflow-x: hidden;">
          <div v-for="(bucket, index) in buckets" :key="index" class="row">
            <div class="col-7">
              <b-form-checkbox
                :checked="checked('fc-' + label, bucket.key)"
                @change="change('fc-' + label, bucket.key)"
                >{{ bucket.key }}</b-form-checkbox
              >
            </div>
            <div class="col-5 text-right">
              <span class="mr-2">
                {{ bucket.doc_count.toLocaleString() }}
              </span>
              <i
                v-show="!checked('fc-' + label, bucket.key)"
                style="cursor: pointer;"
                class="mr-2 fas fa-times-circle"
                @click="
                  remove({
                    label: 'fc-' + label,
                    values: ['-' + bucket.key],
                  })
                "
              ></i>
            </div>
          </div>
        </div>
      </b-list-group-item>
      <b-list-group-item
        v-if="getArray('-').length > 0"
        style="background-color: #f9f6f0;"
      >
        <div
          v-for="(bucket, index) in getArray('-')"
          :key="index"
          style="cursor: pointer;"
          class="row"
          @click="
            add({
              label: 'fc-' + label,
              values: ['-' + bucket],
            })
          "
        >
          <div class="col-12">
            <i class="mr-2 text-danger fas fa-minus-square"></i>
            {{ bucket }}
          </div>
        </div>
      </b-list-group-item>
      <b-list-group-item style="background-color: #f9f6f0;">
        <b-button
          type="button"
          class="btn-blue"
          size="sm"
          variant="primary"
          @click="updateQuery()"
          >{{ $t('update') }}</b-button
        >
      </b-list-group-item>
    </template>
  </b-list-group>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'nuxt-property-decorator'
import { queryStore } from '~/store'

@Component
export default class facetoption extends Vue {
  @Prop({
    default() {
      return []
    },
    required: true,
  })
  buckets!: any

  @Prop({
    default: '',
    required: true,
  })
  label!: string

  query: any = queryStore.query

  openFlag: boolean =
    this.query && this.query.facetsFlag[this.label]
      ? this.query.facetsFlag[this.label]
      : false

  setFacetsFlag() {
    queryStore.setFacetsFlag({ label: this.label, value: !this.openFlag })
    this.openFlag = !this.openFlag
  }

  getArray(type: string): string[] {
    const label = 'fc-' + this.label
    if (!this.query.advanced) {
      return []
    }
    if (this.query.advanced[label]) {
      return this.query.advanced[label][type]
    } else {
      return []
    }
  }

  // 完成
  change(label: string, value: string) {
    const obj = this.query.advanced[label]
    if (obj && obj['+'].includes(value)) {
      queryStore.removeFc({
        label,
        values: [value],
      })
    } else {
      queryStore.setFc({
        label,
        values: [value],
      })
    }
  }

  remove(data: { [keyword: string]: string }) {
    queryStore.setFc(data)
    this.updateQuery()
  }

  add(data: { [keyword: string]: string }) {
    queryStore.removeFc(data)
    this.updateQuery()
  }

  updateQuery() {
    const query = this.$utils.getSearchQueryFromQueryStore(this.query)
    this.$router.push(
      this.localePath({
        name: 'search',
        query,
      }),
      () => {},
      () => {}
    )
  }

  checked(label: string, value: string) {
    const obj = this.query.advanced[label]
    if (obj && obj['+'].includes(value)) {
      return true
    } else {
      return false
    }
  }
}
</script>
