module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: ['/node_modules/(?!@ionic/vue)'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
};
