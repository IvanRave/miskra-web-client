module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jasmine": true
  },
  "extends": [
    "eslint:recommended",
    "airbnb-base"
  ],
  "plugins": [
    "jasmine"
  ],
  "globals": {
    // angular-mocks
    "inject": true
  },
  "rules": {
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": "off",
    "semi": [
      "error",
      "always"
    ],
    "no-console": "off",
    "no-alert": "off",
    "wrap-iife": "off",
    "strict": "off",
    "camelcase": "off",
    "prefer-template": "off",
    "object-shorthand": "off",
    "arrow-body-style": "off",
    "dot-notation": "off",
    "arrow-parens": "off",
    "max-len": "off",
    "default-case": "off",
    "no-else-return": "off",
    // "indent": [
    //   "error",
    //   2
    // ],
    "indent": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-tabs": "off",
    "spaced-comment": "off",
    "vars-on-top": "off",
    "no-var": "off",
    "space-before-blocks": "off",
    "space-before-function-paren": "off",
    "func-names": "off",
    "no-param-reassign": "off",
    "prefer-arrow-callback": "off",
    "padded-blocks": "off",
    "comma-dangle": "off"
  }
};
