<template>
  <div
    id="sidebar"
    class="d-flex flex-column bottom-0 top-0 overflow-y-auto animate"
    :class="ui.sidebarIsOpen ? 'is-open' : 'is-closed'"
  >
    <nav class="nav d-flex flex-column height-full">
      <div class="flex-auto">
        <ul class="border-bottom py-3">
          <li v-if="$auth.isAuthenticated">
            <router-link
              :to="{ name: 'home' }"
              :class="{ active: $router.currentRoute.name === 'home' }"
              v-text="$t('myEtfs')"
            />
          </li>
          <li>
            <router-link
              :to="{ name: 'explore' }"
              :class="{ active: $router.currentRoute.name === 'explore' }"
              v-text="$t('etfs')"
            />
          </li>
          <li>
            <router-link
              :to="{ name: 'create' }"
              :class="{ active: $router.currentRoute.name === 'create' }"
              v-text="$t('createEtf')"
            />
          </li>
        </ul>
        <ul class="py-3">
          <li>
            <a :href="config.exchangeUrl" target="_blank">
              {{ $t('swapBuySell') }}
              <Icon name="external-link" class="ml-1" />
            </a>
          </li>
          <li>
            <a @click="modalOpen = true" v-text="$t('about')" />
          </li>
        </ul>
      </div>
      <div class="d-block m-4">
        <a
          v-if="commitSha"
          :href="`https://github.com/${pkg.repository}/tree/${commitSha}`"
          target="_blank"
        >
          Build {{ pkg.version }}#{{ commitSha.slice(0, 7) }}
          <Icon name="external-link" class="ml-1" />
        </a>
      </div>
    </nav>
    <portal to="modal">
      <ModalAbout :open="modalOpen" @close="modalOpen = false" />
    </portal>
  </div>
</template>

<script>
import pkg from '@/../package.json';

const commitSha = process.env.VUE_APP_COMMIT_SHA;

export default {
  data() {
    return {
      modalOpen: false,
      pkg,
      commitSha
    };
  }
};
</script>

<style lang="scss">
@import '../vars';

#sidebar {
  position: fixed;
  z-index: 5;
  left: -264px;

  width: 264px;
  margin-top: 79px;

  transition: left 0.2s;

  border-right: $border;
  background-color: $panel-background;

  @media (min-width: $width-xl) {
    left: 0;
  }

  ul > li > a {
    display: block;

    padding: 10px 22px 12px;

    color: $white;

    font-size: 16px;

    &.active {
      padding-left: 19px;

      border-left: 3px solid $blue;
      background: $blue-900;
    }
  }

  &.is-open {
    left: 0 !important;
  }
}
</style>
