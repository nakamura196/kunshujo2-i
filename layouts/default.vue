<template>
  <div id="app" style="word-wrap: break-word; overflow-wrap: break-word;">
    <Menu />

    <Header />

    <nuxt :nuxt-child-key="$route.fullPath" />

    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Menu from '~/components/layouts/Menu.vue'
import Footer from '~/components/layouts/Footer.vue'
import Header from '~/components/layouts/Header.vue'

@Component({
  components: {
    Menu,
    Header,
    Footer,
  },
})
export default class LayoutDefault extends Vue {}
</script>

<style>
.btn-blue {
  background-color: #007294 !important;
  border-color: #007294 !important;
}
.link-blue {
  color: #007294 !important;
}
.btn-orange {
  background-color: #ca4316 !important;
  border-color: #ca4316 !important;
}
.link-orange {
  color: #ca4316 !important;
}
.page-item.active .page-link {
  background-color: #007294 !important;
  border-color: #007294 !important;
}
.page-link {
  color: #007294;
}
a {
  text-decoration: none !important;
}
</style>
