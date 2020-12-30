module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    // 'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    camelcase: 'off',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/camelcase': 'off',
    "@typescript-eslint/interface-name-prefix": 'off',
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I?[A-Z]",
          "match": true
        }
      }
    ]
  },
}
