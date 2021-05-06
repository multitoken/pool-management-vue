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
@import '../../vars';

.button {
  line-height: 40px;

  height: 44px;
  margin: 0;
  padding: 0 22px 3px;

  color: $secondary-button-text;
  border: 1px solid $secondary-button-border;
  border-radius: 22px;
  outline: none;
  background-color: $secondary-button-background;

  &:hover {
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
    border-color: $primary-button-border;
    background-color: $primary-button-background;

    &:hover {
      background-color: $primary-button-background-hover;
    }

    &:disabled {
      cursor: not-allowed;

      color: $button-disabled-text;
      border: 1px solid $button-disabled;
      background: $button-disabled;
    }
  }

  &.buttton-non-clickable {
    cursor: auto;
    pointer-events: none;
  }

  &.button-red {
    color: $error;
    border-color: $error;
  }

  &.button-highlight {
    color: $button-disabled;
    border-color: $bg-green;
    background-color: $bg-green;
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
