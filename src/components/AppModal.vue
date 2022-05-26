<!--
  Модальное окно
    свойства:
      show: Boolean     - если true окно отображается <= двойное связывание, можно использовать v-model:show
      title: String     - заглавный текст окна
      message: String   - текст сообщения в окне
    слоты:
      title             - заголовок, заменяет дефолтный title
      body              - тело, заменяет дефолтный message
      footer            - футер, обычно используется для добавления кнопок
      Все слоты имеют ljcneg к свойству show
-->
<template>
  <div v-if="showModal" class="shadow" @click.self="closeModal">
    <div class="modal">
      <div class="close" @click="closeModal">❌</div>
      <slot name="title" v-bind:show="showModal">
        <h4 class="title">{{title}}</h4>
      </slot>
      <slot name="body" v-bind:show="showModal">
        <div class="modal-content">{{message}}</div>
      </slot>
      <slot name="footer" v-bind:show="showModal" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: "app-Modal",
  props: {
    show: Boolean,
    title: String,
    message: String
  },
  emits: ['update:show'],
  setup(props, context) {

    var showModal = computed({
      get() { return props.show },
      set(val) { context.emit('update:show', val) }
    });

    function closeModal() {
      showModal.value = false;
    };

    return {
      showModal,
      closeModal
    }
  },
}
</script>

<style scoped>
.shadow {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.39);
}
.modal {
  background: rgb(34, 33, 33);
  border-radius: 8px;
  padding: 15px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow-wrap: anywhere;
  width: 90%;
  max-width: 600px;
      box-shadow: 10px 10px 24px black;
}
.close {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 7px;
  right: 7px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
  .title {
    color: #ffffff;
  }
  .modal-content {
    margin-bottom: 20px;
    color: chartreuse;
  }

</style>