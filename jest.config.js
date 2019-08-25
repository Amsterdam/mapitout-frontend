module.exports = {
  moduleFileExtensions: ["js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.svg": "<rootDir>/svgTransform.js",
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
    "^.+\\.jsx?$": "babel-jest"
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"],
  moduleNameMapper: {
    "^@/(.*svg)(\\?inline)$": "<rootDir>/src/$1",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: ["**/*.spec.(js|jsx|ts|tsx)"],
  testURL: "http://localhost/",
  collectCoverageFrom: [
    "!**/src/__mocks__/**",
    "!**/src/**/*.spec.{js,vue}",
    "!**/src/main.js",
    "!**/src/router.js",
    "!**/src/registerServiceWorker.js",
    "**/src/**/*.{js,vue}"
  ],
  setupFiles: ["./test/setup.js"],
  globals: {
    "google": true
  }
};
