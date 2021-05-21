<template>
  <span class="Counter">
    <slot />
  </span>
</template>

<style scoped lang="scss">
@import '../../vars';

.Counter {
  line-height: 22px;

  display: inline-block;

  min-width: 22px;
  height: 22px;
  padding: 0 6px;

  text-align: center;

  color: $black;
  border-radius: 11px;
  background-color: $panel-border;
}

.router-link-exact-active,
.active {
  .Counter {
    background-color: $blue;
  }
}

</style>
