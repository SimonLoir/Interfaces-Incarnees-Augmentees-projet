module.exports = {
    extends: ['next', 'turbo', 'prettier'],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        'react/jsx-key': 'off',
        indent: ['error', 4],
        'no-var': 'error',
        'prefer-const': 'warn',
        'func-call-spacing': ['error', 'never'],
        'key-spacing': [2, { beforeColon: false, afterColon: true }],
        'no-debugger': 'error',
        'no-dupe-keys': 'error',
        'no-with': 'error',
        eqeqeq: ['error', 'always'],
        '@next/next/no-img-element': 'off',
        quotes: ['error', 'single', { avoidEscape: true }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/ban-ts-comment': [
            'error',
            'allow-with-description',
        ],
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/no-require-imports': 'warn',
        '@typescript-eslint/no-this-alias': 'error',
        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/type-annotation-spacing': [
            'error',
            {
                before: false,
                after: true,
                overrides: { arrow: { before: true } },
            },
        ],
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
};
