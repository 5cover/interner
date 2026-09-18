import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/**', 'reports/**', 'coverage/**', '.stryker-tmp/**', 'benchmark-results/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['test/**/*.ts'], rules: { 'no-sparse-arrays': 'off' } },
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
      globals: {
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        structuredClone: 'readonly',
        Buffer: 'readonly',
      },
    },
  }
)
