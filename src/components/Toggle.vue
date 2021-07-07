<template>
  <span class="toggle">
    <a
      v-for="(name, key) in options"
      :key="key"
      @click="$emit('select', key)"
      :class="value === key && 'active'"
      v-text="name"
    >
    </a>
  </span>
</template>

<script>
export default {
  props: ['value', 'options']
};
</script>

<style scoped lang="scss">
@import '../vars';

.toggle {
  display: inline-block;

  border-radius: 22px;
  background-color: $secondary-button-background;

  a {
    display: inline-block;

    height: 44px;
    padding: 0 24px 3px;

    color: $secondary-button-text;
    border-radius: 22px;

    line-height: 40px;
  }

  .active {
    background-color: $panel-border !important;
  }
}
</style>
