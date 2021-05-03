module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: ['/node_modules/(?!(@ionic|@ionic-enterprise)/)'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  setupFiles: ['./patchJSDom.js'],
};
