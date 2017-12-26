const siteConfig = {
  title: 'Blessing Skin 插件开发文档',
  // tagline: '',
  // url: 'https://facebook.github.io',
  baseUrl: '/blessing-skin-plugin-docs/',
  organizationName: 'g-plane',
  projectName: 'blessing-skin-plugin-docs',
  headerLinks: [
    { doc: 'structure', label: '文档' }
  ],
  users: [],
  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  /* colors for website */
  colors: {
    primaryColor: '#605ca8',
    secondaryColor: '#205C3B',
  },
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/g-plane/blessing-skin-plugin-docs',
  algolia: {
    apiKey: '555fd4550945ea82c7c7576c52294339',
    indexName: 'blessing-skin'
  },
};

module.exports = siteConfig;
