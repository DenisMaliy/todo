<!-- Корневой компонент приложения -->
<template>
  <!-- Отображаем то что в роутере -->
  <router-view></router-view>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App'
})
</script>

<style>
  @import './app.css'      /* Импортировать стили из файла CSS */
</style>