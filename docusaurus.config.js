// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'VuelaData',
  tagline: 'Tu viaje, mejor informado',
  favicon: 'img/vueladata-logo.png',
  future: {v4: true},

  url: 'https://vueladata.github.io',
  baseUrl: '/documentacion/',

  organizationName: 'vueladata',
  projectName: 'documentacion',
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'en', locales: ['en', 'es']},
  storage: {namespace: 'vueladata'},
  presets: [
    ['classic', {
      docs: {sidebarPath: './sidebars.js'},
      blog: false,
      theme: {customCss: './src/css/custom.css'},
    }],
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {defaultMode: 'dark'},
    navbar: {
      title: 'VuelaData',
      logo: {alt: 'VuelaData', src: 'img/vueladata-logo.png'},
      items: [
        {type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'right', label: 'Technical documentation'},
      ],
    },
    footer: {
      style: 'dark',
      links: [{title: 'Project', items: [
        {label: 'Home', to: '/'},
        {label: 'Technical documentation', to: '/docs'},
      ]}],
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  },
};
export default config;
