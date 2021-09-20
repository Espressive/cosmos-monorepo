// We should almost definitely not be adding rules here. Instead, we should be modifying rules in our eslint-config-espressive package

module.exports = {
  extends: ['@espressive', 'prettier'], // prettier must be last so we override any rules that potentially conflict with Prettier
  overrides: [
    {
      files: ['**/tests/**/*', '**/*.test.js'],
      rules: {
        'no-alert': 0,
        'no-console': 0,
      },
    },
    {
      files: ['tooling/**/*'],
      rules: {
        'no-console': 0,
      },
    },
    {
      files: ['**/next-*/**/*', 'docs/**/*'],
      rules: {
        'jsx-a11y/anchor-is-valid': 0,
        'react/react-in-jsx-scope': 0,
      },
    },
    {
      // We use node to build our icon JSON and also output errors
      files: ['packages/icons/src/*'],
      rules: {
        'no-console': 0,
      },
    },
    {
      // We export icon assets to the root, so we need to disable here
      files: ['packages/icons/*.js'],
      rules: {
        'no-var': 0,
      },
    },
    {
      // Namespace imports are an important part for theme building
      files: ['packages/cascara/src/ui/Chat/themes/**/*.js'],
      rules: {
        'import/no-namespace': 0,
        'sort-keys': 0,
      },
    },
    {
      // Namespace imports are an important part for theme building
      files: ['**/*.fixture.js'],
      rules: {
        'jest/no-jest-import': 0,
        'no-alert': 0,
        'no-console': 0,
        'sort-keys': 0,
      },
    },
  ],
  root: true,
};
