import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'website/dist/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    // Content scripts are classic scripts, not ES modules
    files: ['content/**/*.js'],
    languageOptions: { sourceType: 'script' },
  },
  {
    files: ['scripts/**/*.mjs', 'test/**/*.mjs', 'eslint.config.js'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },
  {
    // Standalone browser helper for generating icons
    files: ['scripts/icons/**/*.js'],
    languageOptions: { sourceType: 'script' },
    rules: { 'no-console': 'off', 'no-unused-vars': 'off' },
  },
  {
    // Showcase website (React + Vite)
    files: ['website/src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // JSX usage isn't tracked by core no-unused-vars without eslint-plugin-react
      'no-unused-vars': ['error', { varsIgnorePattern: '^([A-Z]|motion$)', argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['website/vite.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];
