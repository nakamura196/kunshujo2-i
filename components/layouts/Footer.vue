<template>
  <footer class="py-5 navbar-dark bg-dark text-white">
    <div
      class="container text-center"
      v-html="$utils.getProjectFooter($i18n.locale)"
    ></div>
  </footer>
</template>
