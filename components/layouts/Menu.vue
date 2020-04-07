<template>
  <b-navbar toggleable="sm" type="dark" variant="dark">
    <b-container>
      <!-- Right aligned nav items -->

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav style="text-transform: uppercase;">
        <b-navbar-nav>
          <b-nav-item :to="localePath('index')">
            <span class="text-white">
              {{ $t('index') }}
            </span>
          </b-nav-item>
          <b-nav-item :to="localePath('search')">
            <span class="text-white">
              {{ $t('search') }}
            </span>
          </b-nav-item>
          <b-nav-item
            href="https://nakamura196.github.io/toyo_sim/"
            target="_blank"
          >
            <span class="text-white">
              {{ $t('pix_plot') }}
            </span>
          </b-nav-item>
          <!-- 
          <b-nav-item
            href="https://www.kanzaki.com/works/2016/pub/image-annotator?u=https://umesao.cultural.jp/iiif/top.json"
            target="_blank"
          >
            <span class="text-white">
              {{ $t('iiif_collection') }}
            </span>
          </b-nav-item>
          
          <b-nav-item :to="localePath('test')">
            <span class="text-white">
              {{ $t('test') }}
            </span>
          </b-nav-item>
          <b-nav-item
            :to="
              localePath({ name: 'item-id', params: { id: '002_004_image' } })
            "
          >
            <span class="text-white"> {{ $t('test') }}2 </span>
          </b-nav-item>
          -->
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="switchLocalePath('en')">
            <span v-if="$i18n.locale !== 'en'" class="text-white"
              >English
            </span>
          </b-nav-item>
          <b-nav-item :to="switchLocalePath('ja')">
            <span v-if="$i18n.locale !== 'ja'" class="text-white">日本語 </span>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>
