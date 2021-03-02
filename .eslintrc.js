// We should almost definitely not be adding rules here. Instead, we should be modifying rules in our eslint-config-espressive package

module.exports = {
  extends: ['@espressive', 'prettier'], // prettier must be last so we override any rules that potentially conflict with Prettier
  overrides: [
    {
      files: ['**/next-*/**/*', 'docs/**/*'],
      rules: {
        'jsx-a11y/anchor-is-valid': 0,
        'react/react-in-jsx-scope': 0,
      },
    },
  ],
  root: true,
  rules: {
    // TODO: Remove each of these lines below until there are 10 files with errors and resolve with --fix or manually, then submit a PR and repeat
    'consistent-return': 0,
    'eslint-comments/disable-enable-pair': 0,
    'eslint-comments/no-unused-disable': 0,
    'eslint-comments/require-description': 0,
    'import/named': 0,
    'import/no-anonymous-default-export': 0,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'import/no-unresolved': 0,
    'jest/no-done-callback': 0,
    'multiline-comment-style': 0,
    'no-alert': 0,
    'no-extra-boolean-cast': 0,
    'no-prototype-builtins': 0,
    'no-useless-return': 0,
    'prefer-const': 0,
    'prefer-destructuring': 0,
    'prefer-spread': 0,
    'prefer-template': 0,
    'react/button-has-type': 0,
    'react/display-name': 0,
    'react/forbid-prop-types': 0,
    'react/function-component-definition': 0,
    'react/jsx-boolean-value': 0,
    'react/jsx-key': 0,
    'react/jsx-no-bind': 0,
    'react/no-unknown-property': 0,
    'react/prop-types': 0,
    'sort-imports': 0,
    'sort-keys': 0,
  },
};
