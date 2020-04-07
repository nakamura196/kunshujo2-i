<template>
  <div>
    <div class="back">
      <b-container class="py-5">
        <b-row>
          <b-col sm="2"></b-col>
          <b-col sm="8" class="text-white">
            <h1 class="mt-5">
              {{ $utils.getProjectName($i18n.locale) }}
            </h1>
            <h5 class="my-5">
              {{ $utils.getProjectDescription($i18n.locale) }}
            </h5>
          </b-col>
          <b-col sm="2"></b-col>
        </b-row>
      </b-container>
    </div>

    <b-container class="py-5">
      <p>
        &nbsp;&nbsp;本システムは東京大学総合図書館が公開する<a
          class="link-blue"
          href="https://iiif.dl.itc.u-tokyo.ac.jp/repo/s/tanaka"
          >田中芳男・博物学コレクション</a
        >の資料と、国立国会図書館デジタルコレクションで公開されている<a
          class="link-blue"
          href="http://dl.ndl.go.jp/info:ndljp/pid/2610716"
          >張交帖</a
        >を対象として、貼り込まれた資料単位での画像検索が可能なプロトタイプです。2019年1月末時点において、99帖、13,069コマ、34,746件の貼り込み資料が検索対象となっています。
      </p>

      <p>
        &nbsp;&nbsp;貼り込み資料の抽出は、物体検出アルゴリズムYOLO
        v3を用いて、機械的に実行しています。また、<a
          class="link-blue"
          href="https://kunshujo.dl.itc.u-tokyo.ac.jp/"
          >電子展示『捃拾帖』</a
        >で公開されている貼り込み資料2,645件をモデルのファインチューニングに利用しています。詳細については、<a
          class="link-blue"
          href="https://docs.google.com/presentation/d/1sfb57LXGQSNgJEvaqQUsjzImA6hoVBFBHyban4deYGA/edit?usp=sharing"
          >こちらの資料</a
        >をご確認ください。機械的な抽出処理を行っているため、
        <b
          >貼り込み資料の抽出漏れ、および抽出誤りが含まれている点にご注意ください</b
        >。
      </p>

      <p>
        &nbsp;&nbsp;画像の閲覧ビューアには、人文学オープンデータ共同利用センターが開発した<a
          class="link-blue"
          href="http://codh.rois.ac.jp/software/iiif-curation-viewer/"
          >IIIF Curation Viewer</a
        >を利用しています。
      </p>
    </b-container>
    <div style="background-color: #f9f6f0;">
      <b-container class="py-5">
        <h3 class="mb-4">{{ $t('news') }}</h3>
        <ul>
          <li>2019年X月X日：ああああ</li>
          <li>2019年X月X日：ああああ</li>
        </ul>
      </b-container>
    </div>
    <b-container class="py-5">
      <h3 class="mb-4">{{ $t('example') }}</h3>
      <p>ああああああああああ</p>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {
  head() {
    return {
      titleTemplate: null,
    }
  }
}
</script>

<style scoped>
.back {
  /* 画面いっぱいに背景画像を貼り付ける */
  background-image: url('~@/static/img/ogp/home.jpg');
  background-size: cover;
  position: relative;
  height: 100%;
}
.back::before {
  /* 透過した黒を上から重ねるイメージ */
  background-color: rgba(0, 0, 0, 0.4);
  /* 自由に位置指定 */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  content: ' ';
}
</style>
