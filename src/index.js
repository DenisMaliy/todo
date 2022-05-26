//////////////////////////////////////////////////////////////////////
//  Главный модуль приложения
//////////////////////////////////////////////////////////////////////

import { createApp } from 'vue';
import { store } from './store/store';
import router from './router';
import App from './App.vue';

const app = createApp(App);   //  Создаем Vue приложение

app.use(store);               //  Подключаем и используем хранилище VueX

app.use(router);              //  Подключаем и используем роутер Vue Router

app.mount('#app');            //  Монтируем приложение
