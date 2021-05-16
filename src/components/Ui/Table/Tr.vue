<template>
  <span>
    <router-link
      v-if="to"
      :to="to"
      class="line v-align-middle px-3 py-2 highlight d-flex"
    >
      <slot />
    </router-link>
    <div v-else class="line px-4 py-3 d-flex">
      <slot />
    </div>
  </span>
</template>

<script>
export default {
  props: ['to']
};
</script>

<style scoped lang="scss">
@import '../../../vars';

.line {
  display: flex;

  text-align: right;

  color: $white;
  border-top: $border;

  align-items: center;
}

</style>
