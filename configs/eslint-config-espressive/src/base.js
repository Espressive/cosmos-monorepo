// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
// "error" or 2 - turn the rule on as an error (exit code will be 1)

module.exports = {
  overrides: [
    {
      files: '*.fixture.js',
      rules: {
        'no-console': 0,
      },
    },
    {
      files: '*.config.js',
      rules: {
        'sort-keys': 0,
      },
    },
  ],
  rules: {
    'no-console': 2,
    'no-unused-vars': 2,
    'sort-imports': [2, { ignoreDeclarationSort: true }],
    'sort-keys': 2,
  },
};
