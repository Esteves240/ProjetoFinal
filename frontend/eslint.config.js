// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      // Desativadas — uso de any é aceitável neste projeto
      '@typescript-eslint/no-explicit-any': 'off',
      // Desativadas — inferência de tipos é opcional
      '@typescript-eslint/no-inferrable-types': 'off',
      // Desativadas — constructor injection é o padrão que usámos
      '@angular-eslint/prefer-inject': 'off',
      // Desativadas — funções vazias são aceitáveis
      '@typescript-eslint/no-empty-function': 'off',
      'no-empty': 'off',
      // Mantém apenas como warning
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateRecommended,
      // Removido templateAccessibility — acessibilidade não é requisito do projeto
    ],
    rules: {
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },
]);
