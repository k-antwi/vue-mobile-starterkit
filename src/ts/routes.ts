import HomePage from '../pages/demo/home.vue';
import AboutPage from '../pages/demo/about.vue';
import FormPage from '../pages/demo/form.vue';
import CatalogPage from '../pages/demo/catalog.vue';
import ProductPage from '../pages/demo/product.vue';
import SettingsPage from '../pages/demo/settings.vue';
import DynamicRoutePage from '../pages/demo/dynamic-route.vue';
import RequestAndLoad from '../pages/demo/request-and-load.vue';
import NotFoundPage from '../pages/demo/404.vue';

interface RouteUser {
  firstName: string;
  lastName: string;
  about: string;
  links: { title: string; url: string }[];
}

interface RouteParams {
  router: any;
  to: { params: Record<string, string> };
  resolve: (component: object, options?: object) => void;
}

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/demo/about/',
    component: AboutPage,
  },
  {
    path: '/demo/form/',
    component: FormPage,
  },
  {
    path: '/demo/catalog/',
    component: CatalogPage,
  },
  {
    path: '/demo/product/:id/',
    component: ProductPage,
  },
  {
    path: '/demo/settings/',
    component: SettingsPage,
  },
  {
    path: '/demo/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/demo/request-and-load/user/:userId/',
    async: ({ router, to, resolve }: RouteParams) => {
      const app = router.app;
      app.preloader.show();

      const userId = to.params.userId;

      setTimeout(() => {
        const user: RouteUser = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ],
        };
        app.preloader.hide();

        resolve(
          { component: RequestAndLoad },
          { props: { user } }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
