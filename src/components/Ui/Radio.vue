<template>
  <div id="wrapper">
    <input
      type="radio"
      name="radio-group"
      :checked="checked"
      @change="onChange"
    />
    <div id="background">
      <div id="circle"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['checked', 'onChange']
};
</script>

<style scoped lang="scss">
@import '@/vars';

#wrapper {
  position: relative;

  display: inline-block;
  flex: 0 0 auto;

  box-sizing: content-box;
  width: 18px;
  height: 18px;
  padding: 1px;

  cursor: pointer;
}

input {
  position: absolute;
  z-index: 1;
  top: 0px;
  right: 0px;
  left: 0px;

  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;

  cursor: inherit;

  opacity: 0;
}

input:enabled:checked + div div {
  border: 4px solid $blue;
  background: #ffffff;
}

input:enabled:not(:checked) + div div {
  border: 1.5px solid #41476b;
}

#background {
  position: relative;

  display: inline-block;

  box-sizing: border-box;
  width: 18px;
  height: 18px;
}

#background:before {
  position: absolute;

  content: '';
  transform: scale(0, 0);
  pointer-events: none;

  opacity: 0;
  border-radius: 50%;
}

#circle {
  position: absolute;
  top: 0;
  left: 0;

  box-sizing: border-box;
  width: 100%;
  height: 100%;

  border-style: solid;
  border-radius: 50%;
}
</style>
