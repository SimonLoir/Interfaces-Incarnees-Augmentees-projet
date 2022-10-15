module.exports = {
    extends: ['next', 'turbo', 'prettier'],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        'react/jsx-key': 'off',
        indent: ['error', 4],
        'no-var': 'error',
        'prefer-const': 'warn',
        'no-unused-vars': 'error',
        'func-call-spacing': ['error', 'never'],
        'key-spacing': [2, { beforeColon: false, afterColon: true }],
        'no-debugger': 'error',
        'no-dupe-keys': 'error',
        'no-with': 'error',
    },
};
