<template>
  <span>
    <router-link
      v-if="to"
      :to="to"
      class="line v-align-middle px-3 py-2 highlight d-flex"
    >
      <slot />
    </router-link>
    <div v-else-if="slim" class="line px-3 py-1 d-flex">
      <slot />
    </div>
    <div v-else class="line px-3 py-2 d-flex">
      <slot />
    </div>
  </span>
</template>

<script>
export default {
  props: ['to', 'slim']
};
</script>

<style scoped lang="scss">
@import '../../../vars';

.line {
  display: flex;
  align-items: center;

  text-align: right;

  color: $white;
  border-top: $border;
}
</style>
