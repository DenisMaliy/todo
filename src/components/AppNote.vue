<!-- Компонент отображения превью списка заметок
  свойства:
    note: Object      - объект заметки
    maxItems: Number  - максимальное число отображаемых пунктов todo
  события:
    onEdit: Boolean   - пользователь нажал кнопку "Изменить заметку"
    onDelete: Boolean - пользователь нажал кнопку "Удалить заметку"
-->
<template>
  <div class="conteiner paper" >
    <div class="header toTop">
      <AppPic src="documentdelete.png" @click="$emit('onDelete')" :size="+50" title="Удалить заметку"/>
      <div class="spacer title">{{note.title}}</div>
      <AppPic src="edit.png" @click="$emit('onEdit')" :size="+50" title="Изменить заметку"/>
    </div>
    <div class="items">
      <div v-for="(item, index) in note.todos.slice(0,maxItems)" :key="'item-'+index" class="item">
        <input type="checkbox" :checked="item.checked" @click.prevent>
        <div :class="{checkedLabel:item.checked}">{{item.label}}</div>
      </div>
      <div v-if="note.todos.length>maxItems" class="info">... еще {{note.todos.length-maxItems}} задач.</div>
      <div v-if="note.todos.length===0" class="info">нет задач</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import AppPic from './AppPic.vue';

export default defineComponent({
  name: 'app-Note',
  props: {
    note: Object,
    maxItems: {
      type: Number,
      default: 5
    }
  },
  emits: ['onEdit', 'onDelete'],
  components: {
    AppPic
  }
})
</script>

<style scoped>
.title {
  text-align: center;
  font-weight: bold;
  color: black;
}
.item {
  display: flex;
  font-style: oblique;
}
.items {
  margin: 10px 0px 10px 0px;
}
.header {
  display: flex;
  text-align: center;
  color: gray;
}
.conteiner {
  min-width: auto;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-wrap: anywhere;
  color: black;
}
.info {
  margin-left: 5px;
  color: gray;
}
.checkedLabel {
  text-decoration: line-through;
  color: gray;
}

</style>