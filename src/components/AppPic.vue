<!-- Компонент для отображения картинки
  свойства:
    src: String       - путь к файлу с изображением
    size: Number      - размер изображения в пикселях, по умолчанию 32
    disabled: Boolean - флаг применения єфекта приглушености
-->
<template>
  <img
    :src="src"
    :style="{height: (size-4)+'px'}"
    :class="['app-pic', {disabled: disabled}]"
  />
</template>

<script>
export default {
  name: 'app-Pic',
  props: {
    src: String,
    size: {
      default: 32,
      type: Number
    },
    disabled: Boolean
  }
}
</script>

<style scoped>
  .app-pic {
    width: auto;
    margin: 2px;
    transition-duration: 0.5s;
  }
  .app-pic:hover {
    cursor: pointer;
    background-color: transparent;
    /* transform: rotate(360deg);*/
    transform: scale(1.2);
  }

  .disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
</style>
