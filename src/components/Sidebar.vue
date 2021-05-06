<template>
  <div
    id="sidebar"
    class="d-flex flex-column bottom-0 top-0 overflow-y-auto animate"
    :class="ui.sidebarIsOpen ? 'is-open' : 'is-closed'"
  >
    <nav class="nav d-flex flex-column height-full">
      <div class="d-flex flex-column flex-auto">
        <ul class="border-bottom py-3">
          <li v-if="$auth.isAuthenticated">
            <router-link
              :to="{ name: 'home' }"
              :class="{ active: $router.currentRoute.name === 'home' }"
              v-text="$t('myShares')"
            />
          </li>
          <li>
            <router-link
              :to="{ name: 'explore' }"
              :class="{ active: $router.currentRoute.name === 'explore' }"
              v-text="$t('etfs')"
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
        </ul>
        <span class="d-flex text-center justify-content-around connect">
          Connect with us
        </span>
        <div class="d-flex justify-content-around">
          <a
            href="https://medium.com/multitoken"
            target="_blank"
            rel="noreferrer"
          >
            <img alt="Medium page" src="~/@/assets/logo-medium.svg" />
          </a>
          <a href="https://t.me/MultiToken" target="_blank" rel="noreferrer">
            <img alt="Telegram channel" src="~/@/assets/logo-telegram.svg" />
          </a>
          <a
            href="https://twitter.com/multitokencom"
            target="_blank"
            rel="noreferrer"
          >
            <img alt="Twitter page" src="~/@/assets/logo-twtr.svg" />
          </a>
          <a
            href="https://github.com/multitoken/pool-management-vue"
            target="_blank"
            rel="noreferrer"
          >
            <img alt="GitHub" src="~/@/assets/logo-github.svg" />
          </a>
        </div>
        <a
          class="d-flex text-center my-2 link-text justify-content-around protocol-link"
          href="https://www.multitoken.com/#multitoken-protocol"
          target="_blank"
        >
          <ins>
            MultiToken Protocol
          </ins>
        </a>
      </div>
      <div class="d-block m-4">
        <span class="d-flex text-center justify-content-around risk-warning">
          Use at your own risk
        </span>
      </div>
    </nav>
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

.connect {
  margin-top: auto;

  font-size: $font-size-bigger;
}

.protocol-link {
  font-size: $font-size-bigger;
}

.risk-warning {
  color: #f00;

  font-size: 20px;
}

.justify-content-around {
  justify-content: space-around;
}
</style>
