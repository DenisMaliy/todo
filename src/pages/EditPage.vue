<!-- Страница изменения заметки позволяет определенную заметку отредактировать, отметить пункты Todo, а после сохранить изменения.

    Действия с заметкой:
      - сохранить изменения: есть кнопка или, в случае попытки закрить редактор, появляется предупреждение с возможность сохранить
      - отменить редактирование: в случае попытки закрить редактор, появляется предупреждение с возможность выйти без сохранения
      - удалить: появляется предупреждение с возможностью подтвердить или отменить удаление
      - отменить внесенное изменение: есть кнопка (буфер до 100 изменений)
      - повторить отмененное изменение: есть кнопка (буфер до 100 изменений)

    Действия с пунктами Todo:
      - добавить: кнопка на панели
      - удалить: кнопка в конце пункта todo
      - отредактировать текст
      - отметить как выполненный: checbox в начале пункта todo

    Компонент принимает, через vue router, в props.itemIndex - номер редактируемой заметки, данные которой берет из хранилища vuex.
    Если страница была открыта в ручную или обновлена, она автоматически перенаправит на главную
-->

<template>
  <div v-if="itemIndex" class="papers editor">
    <!-- Заголовок с кнопкой "закрыть" -->
    <div class="flex">
      <div class="itemText">
        <input
          v-model="editData.title"
          type="text"
          @change="newChange"
          class="input noBorder title"
          placeholder="Заголовок"
        />
      </div>
      <app-Pic src="close.png" @click="closeEditor"/>
    </div>
    <!-- Меню с кнопками -->
    <div class="flex">
      <app-Pic src="add.png" @click="addItem" class="mr" title="Добавить новый пункт"/>
      <div class="separator" />
      <app-Pic src="undo.png" :disabled="!isCanUdo" @click="udo" class="mr" title="Отменить последнее изменение"/>
      <app-Pic src="redo.png" :disabled="!isCanRedo" @click="redo" title="Вернуть отмененное изменение"/>
      <div class="separator" />
      <app-Pic src="save.png" :disabled="isSaved" @click="save" title="Сохранить внесенные изменения"/>
      <div class="separator" />
      <app-Pic src="documentdelete.png" @click="showDeleteConfirm=true" title="Удалить заметку"/>
    </div>
    <hr>
    <!-- Список пунктов todo -->
    <div class="list">
      <div v-for="(item, index) in editData.todos" :key="'item-'+index" class="item">
        <div class="itemCheck">
          <input v-model="item.checked" type="checkbox" class="x2 checkbox" @change="newChange" />
        </div>
        <div class="itemText">
          <input
            v-model="item.label"
            type="text"
            @change="newChange"
            :id="'input'+index"
            class="input"
            placeholder="Пункт списка задач"
          />
        </div>
        <div class="itemActions">
          <app-Pic src="remove.png" @click="deleteItem(index)"/>
        </div>
      </div>
    </div>
    <!-- Окно подтверждения удаления -->
    <app-modal
      v-model:show="showDeleteConfirm"
      :title='`Удалить заметку "${editData.title}"?`'
      message="Вы точно уверены что хотите удалить заметку?"
    >
      <template v-slot:footer >
        <div class="flex">
          <div class="spacer" />
          <button class="btn-red mr" @click="deleteNote">Удалить</button>
          <button class="btn-green" @click="showDeleteConfirm=false">Отмена</button>
        </div>
      </template>
    </app-modal>
    <!-- Окно подтверждения выбора действия при выходе -->
    <app-modal
      v-model:show="showExitConfirm"
      :title='`Выйти из редактирования заметки "${editData.title}"`'
      message="Внимание! Есть несохраненные изменения! Выберите действие."
    >
      <template v-slot:footer >
        <div class="flex">
          <button class="btn-red" @click="goHome">Отклонить все изменения и выйти</button>
          <div class="spacer"/>
          <button class="btn-green" @click="saveAndExit">Сохранить и выйти</button>
          <div class="spacer"/>
          <button class="btn-blue" @click="showExitConfirm=false">Назад к редактированию</button>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { cloneDeep } from "lodash";
import AppPic from '../components/AppPic.vue';
import AppModal from '../components/AppModal.vue';

export default {
  name: "EditPage",
  props: ['itemIndex'],
  components: {
    AppPic,
    AppModal
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    if (!props.itemIndex) router.push({ name: "home" }); //  Если нет номера индекса в itemIndex - перенаправление на главную
    const variants = ref([]);
    const variant = ref(0);
    const isSaved = ref(true);
    const showDeleteConfirm = ref(false);
    const showExitConfirm = ref(false);
    variants.value.push(cloneDeep(store.state.notes[props.itemIndex]));
    const maxVariant = 100;
    const isCanRedo = computed(() => (variant.value < maxVariant && variant.value < variants.value.length - 1));
    const isCanUdo = computed(() => (variant.value > 0));
    const editData = computed(() => (variants.value[variant.value]));
    var lastVariant = cloneDeep(editData.value);

    /**
     * Отменить одно изменение
     */
    function udo() {
      if (!isCanUdo.value) return;
      isSaved.value = false;
      variant.value--;
      lastVariant = cloneDeep(editData.value);
    };

    /**
     * Повторить одно отмененное изменение
     */
    function redo() {
      if (!isCanRedo.value) return;
      isSaved.value = false;
      variant.value++;
      lastVariant = cloneDeep(editData.value);
    };

    /**
     * Обрабочик изменений.
     * Необходимо вызывать в случае внесения изменений
     */
    function newChange() {
      if (variant.value >= maxVariant) variants.value.splice(0, 1);
      variants.value.splice(variant.value, 0, cloneDeep(lastVariant));
      redo();
      if (variant.value < variants.value.length - 1) variants.value.splice(variant.value + 1, maxVariant);
    }

    /**
     * Обработчик событий клавиатуры Ctrl+Z Ctrl+Y
     */
    function keyupHandler(evt) {
      if (evt.ctrlKey && evt.code === "KeyZ") udo();
      else if (evt.ctrlKey && evt.code === "KeyY") redo();
    };

    /**
     * Регистрируем слушателя клавиатуры когда смонтировался компонент
     */
    onMounted(() => {
      document.addEventListener("keyup", keyupHandler);
    });

    /**
     * Уничтожаем слушателя клавиатуры когда демонтировался компонент
     */
    onUnmounted(() => {
      document.removeEventListener("keyup", keyupHandler);
    });

    /**
     * Сохранить изменения
     */
    function save() {
      store.commit('saveItem', {
        itemIndex: props.itemIndex,
        itemData: editData.value
      });
      isSaved.value = true;
    };

    /**
     * Перейти на главную страницу
     */
    function goHome() {
      router.push({ name: 'home' })
    }

    /**
     * Закрыть редактор заметки если сохранено или отобразить окно
     * с предупреждением о несохраненных данных
     */
    function closeEditor() {
      if (isSaved.value) goHome();
      else showExitConfirm.value = true;
    }

    /**
     * Сохранить изменения и выйти на главную
     */
    function saveAndExit() {
      save();
      goHome();
    }

    /**
     * Удалить заметку и вернуться на главную
     */
    function deleteNote() {
      store.commit('deleteItem', props.itemIndex);
      goHome();
    }

    /**
     * Создать новый пункт todo и поместить курсор в него
     */
    function addItem() {
      editData.value.todos.push({label: '', checked: false});
      newChange();
      setTimeout(() => {
        var newEl = document.getElementById('input'+(editData.value.todos.length-1));
        newEl.focus();
      }, 300);
    }

    /**
     * Удалить пункт todo
     * @param {*} index - номер елемента массива удаляемого пункта
     */
    function deleteItem(index) {
      editData.value.todos.splice(index,1);
      newChange();
    }

    return {
      udo,
      redo,
      editData,
      isCanRedo,
      isCanUdo,
      newChange,
      save,
      isSaved,
      showDeleteConfirm,
      showExitConfirm,
      goHome,
      closeEditor,
      deleteNote,
      saveAndExit,
      addItem,
      deleteItem
    };
  }
}
</script>

<style scoped>
.editor {
  width: min(80%, 1500px);
}
.x2 {
  transform: scale(2);
}

.title {
  display: flex;
  font-size: min(7vw, 1.5em);
  color: blue;
}
.list {
  display: flex;
  flex-direction: column;
}

.item {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: stretch;
}

.itemCheck {
  align-self: center;
}

.itemText {
  align-self: center;
  flex-grow: 1;
  font-size: min(3vw, 1em);
}
.itemActions {
  align-self: center;
}

.separator {
  margin-inline: 10px;
  width: 2px;
  background: linear-gradient(90deg, white 0%, white 49%, gray 51%, gray 100%);
}

</style>