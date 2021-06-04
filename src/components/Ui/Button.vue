<template>
  <button @click="$emit('click')" class="button" :disabled="loading">
    <UiLoading v-if="loading" />
    <slot v-else />
  </button>
</template>

<script>
export default {
  props: {
    loading: Boolean
  }
};
</script>

<style lang="scss">
@use 'sass:color';
@import '../../vars';

.button {
  line-height: 40px;

  height: 44px;
  margin: 0;
  padding: 0 22px 3px;

  transition: 0.3s;

  color: $secondary-button-text;
  border: 1px solid $secondary-button-border;
  border-radius: 22px;
  outline: none;
  background-color: $secondary-button-background;

  &:hover {
    color: $link-text;
    background-color: $secondary-button-background-hover;
  }

  &:disabled {
    cursor: not-allowed;

    color: $button-disabled-text;
    border: 1px solid $button-disabled;
    background: $button-disabled;
  }

  &.button-sm {
    font-size: 12px;
    line-height: 34px;

    height: 36px;
    padding: 0 14px;

    border-radius: 19px;
  }

  &.button-primary {
    color: $primary-button-text;
    border-color: $bg-green;
    background-color: $bg-green;

    &:hover {
      color: $secondary-button-text;
      border-color: color.scale($bg-green, $lightness: -20%);
      background-color: color.scale($bg-green, $lightness: -10%);
    }

    &:disabled {
      cursor: not-allowed;

      color: $button-disabled-text;
      border: 1px solid $button-disabled;
      background: $button-disabled;
    }
  }

  &.button-lp-tokens {
    // font-size: 16px;
    line-height: 18px;

    width: 110px;
    margin: 3px 0;
    padding: 0 5px;
  }

  &.buttton-non-clickable {
    cursor: auto;
    pointer-events: none;
  }

  &.button-red {
    color: $error;
    border-color: $error;
  }

  &.notification-red {
    border-color: $error;
    background-color: $error;
  }

  &.notification-green {
    border-color: $bg-green;
    background-color: $bg-green;
  }

  &.notification-gray {
    color: $black;
    border-color: $border-mint;
    background-color: $bg-gray-light;
  }
}

</style>
