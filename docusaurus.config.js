// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'VuelaData',
  tagline: 'Tu viaje, mejor informado',
  favicon: 'img/favicon.ico',
  future: {v4: true},

  url: 'https://lluyss123.github.io',
  baseUrl: '/documentacion-vueladata/',

  organizationName: 'lLuyss123',
  projectName: 'documentacion-vueladata',
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'es', locales: ['es']},
  presets: [
    ['classic', {
      docs: {sidebarPath: './sidebars.js'},
      blog: false,
      theme: {customCss: './src/css/custom.css'},
    }],
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {defaultMode: 'light', disableSwitch: true},
    navbar: {
      title: 'VuelaData',
      logo: {alt: 'VuelaData', src: 'img/logo.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'right', label: 'Documentación técnica'},
      ],
    },
    footer: {
      style: 'dark',
      links: [{title: 'Proyecto', items: [
        {label: 'Inicio', to: '/'},
        {label: 'Documentación técnica', to: '/docs'},
      ]}],
      copyright: `VuelaData · ${new Date().getFullYear()} · Prototipo de experiencia de viaje`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  },
};
export default config;
