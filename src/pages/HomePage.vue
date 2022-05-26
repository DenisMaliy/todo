<!-- Главная страница приложения.
      На главной странице отображается список всех заметок.
      Действия на главной:
        - перейти к созданию новой заметки
        - перейти к изменению (кнопка на компоненте отображения конкректной заметки)
        - удалить (кнопка на компоненте отображения конкректной заметки)
        В случае удаления, появляется предупреждение с возможностью подтвердить или отменить удаление
        Если список заметок пуст, то отображается соответствующее сообщение
-->

<template>
  <!-- заголовок -->
  <h2 class="title">Заметки</h2>
  <!-- кнопка "Создать новую заметку" -->
  <div class="add-icon">
    <app-Pic src="documentnew.png" :size="+50" @click="newItem" title="Создать новую заметку"/>
  </div>
  <!-- список заметок -->
  <div class="notes">
    <app-Note
      v-for="(note, index) in $store.state.notes"
      :key="index+note"
      :note="note"
      @onDelete="showDeleteConfirm(index)"
      @onEdit="editItem(index)"
    />
    <h2 v-if="$store.state.notes.length===0" class="spacer">Заметок нет</h2>
  </div>
  <!-- модальное окно -->
  <app-modal
    v-model:show="showConfirm"
    :title='`Удалить заметку "${$store.state.notes[selectedItem]?.title}"?`'
    message="Вы точно уверены что хотите удалить заметку?"
  >
    <template v-slot:footer >
      <div class="flex">
        <div class="spacer" />
        <button class="btn-red mr" @click="deleteItem">Удалить</button>
        <button class="btn-green" @click="showConfirm=false">Отмена</button>
      </div>
    </template>
  </app-modal>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AppNote from '../components/AppNote.vue';
import AppModal from '../components/AppModal.vue';
import AppPic from '../components/AppPic.vue';

export default defineComponent({
  name: 'Home page',
  components: {
    AppNote,
    AppModal,
    AppPic
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const showConfirm = ref(false);                               //  тригер отображения окна подтверждения удаления заметки
    var selectedItem = ref(null);                                 //  элемент выбранный для удаления

    /**
     * Отобразить окно подтверждения удаления заметки
     * @param {*} index - номер елемента массива заметок удаляемой заметки
     */
    function showDeleteConfirm(index) {
      selectedItem.value = index;
      showConfirm.value = true;
    };

    /**
     * Удалить выбранную заметку
     */
    function deleteItem() {
      store.commit('deleteItem', selectedItem.value);
      showConfirm.value = false;
      selectedItem.value = null;
    }

    /**
     * Перейти к редактированию заметки
     * @param {*} index - номер елемента массива заметок редактируемой заметки
     */
    function editItem(index) {
      router.push({
        name: 'edit',
        params: { itemIndex: index }
      })
    };

    /**
     * Создать новую заметку и перейти к ее редактированию
     */
    function newItem() {
      store.commit('newItem', {title: 'Новая заметка', todos: []});
      editItem(store.state.notes.length-1);
    }

    return {
      showDeleteConfirm,
      editItem,
      showConfirm,
      selectedItem,
      deleteItem,
      newItem
    }
  }
})
</script>

<style scoped>
.notes {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
}
.add-icon {
  position: fixed;
  right: 1px;
  top: 1px;
}
.title {
text-align: center;
  color: white;
  background: black;
  opacity: 0.8;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0;
}
</style>