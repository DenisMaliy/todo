////////////////////////////////////////////////////////////////
//  VUE ROUTER
////////////////////////////////////////////////////////////////

import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import EditPage from '../pages/EditPage.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //  Роут главной страницы
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    //  Роут страницы редактора заметки
    {
      path: '/edit',
      name: 'edit',
      props: true,  //  Разрешить передачу параметров компоненту в props через router
      component: EditPage
    },
    //  Роут страницы 404
    {
      path: '/:catchAll(.*)*',
      component: () => import('../pages/Error404.vue')
    }
  ]
})

export default router;
