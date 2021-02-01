module.exports = {
    extends: [
        'react-app',
        'react-app/jest',
        'plugin:jest/recommended',
        'prettier',
        'prettier/react',
        'plugin:prettier/recommended'
    ],
    plugins: ['react', 'jest', 'prettier'],
    env: {
        browser: true,
        es6: true,
        jest: true
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'comma-dangle': 'error',
        'no-irregular-whitespace': 'error',
        'prettier/prettier': 'error',
        'no-throw-literal': 'off'
    }
}
