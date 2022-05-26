<!-- Страница ошибки Not Found 404  -->
<template>
  <div style="text-align:center">
    <div>
      <div style="font-size: 30vh">404</div>
      <h2 style="opacity:.6">Такой страницы не существует...</h2>
      <router-link to="/">
        <button class="btn-red">Перейти на главную страницу</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404'
})
</script>
