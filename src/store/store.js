//////////////////////////////////////////////////////////////////////////////////////////////
//  VueX State приложения
//////////////////////////////////////////////////////////////////////////////////////////////

import { createStore } from 'vuex';

/**
 * Сохраняет данные в local storage
 * @param {+} data Данные для сохранения
 */
function saveStore(data) {
  window.localStorage.setItem('appData', JSON.stringify(data));
};

/**
 * Читает данные из local storage
 * @returns прочитанные данные либо null
 * В случае ошибки чтения либо парсинга данных, поврежденные данные будут удалены
 */
function loadStore() {
  var data = null;
  try {
    data = JSON.parse(window.localStorage.getItem('appData'));
  } catch (error) {
    localStorage.removeItem('appData');
  }
  return data;
};

var loadedStore = loadStore();                                    //  Считать данные приложения из local storage
var notes = [];                                                   //  Массив для данных заметок

if (Array.isArray(loadedStore?.notes)) notes = loadedStore.notes; //  если данные содержат notes, берем их
else if (loadedStore!=null) localStorage.removeItem('appData');   //  Если в данных содержится что то иное - удалить

/////////////////////////////////////////////////////////////////
//  Создаем и экспортируем store
export const store = createStore({
  state: () => ({ notes: notes }),
  mutations: {
    // Удаляет заметку из хранилища по ее индексу
    deleteItem(state, itemIndex) {
      state.notes.splice(itemIndex, 1);
      saveStore(state);
    },
    // Сохраняет изменения заметки по ее индексу
    saveItem(state, payload) {
      state.notes[payload.itemIndex] = payload.itemData;
      saveStore(state);
    },
    // Создает новую заметку
    newItem(state, data) {
      state.notes.push(data);
      saveStore(state);
    }
  }
});
