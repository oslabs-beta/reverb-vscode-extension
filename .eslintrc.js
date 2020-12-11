const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: [
        'airbnb-typescript/base',
        'plugin:unicorn/recommended',
        'prettier',
        'prettier/@typescript-eslint',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: [
            './tsconfig.eslint.json',
            './build/tsconfig.json',
            './src/tsconfig.json',
            './test/tsconfig.json',
        ],
    },
    plugins: ['@typescript-eslint', 'unicorn'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.ts', '.js', '.json'],
            },
        },
    },
    rules: {
        'import/extensions': OFF,
        'import/no-cycle': OFF,
        'import/no-mutable-exports': OFF,
        'import/no-unresolved': [WARN, { ignore: ['vscode'] }],

        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-non-null-assertion': OFF,
        '@typescript-eslint/naming-convention': OFF,
        '@typescript-eslint/no-unsafe-assignment': OFF,

        'unicorn/consistent-function-scoping': OFF,
        'unicorn/filename-case': [
            ERROR,
            {
                cases: {
                    camelCase: true,
                    pascalCase: true,
                },
            },
        ],
        'unicorn/import-style': OFF,
        'unicorn/no-abusive-eslint-disable': OFF,
        'unicorn/no-process-exit': OFF,
        'unicorn/prevent-abbreviations': OFF,
        'unicorn/no-useless-undefined': OFF,
        'unicorn/no-reduce': OFF,

        'func-names': OFF,
        'no-bitwise': OFF,
        'no-console': OFF,
        'no-param-reassign': OFF,
        'no-plusplus': OFF,
        'no-unused-expressions': OFF,
        'no-underscore-dangle': OFF,
        'no-await-in-loop': OFF,
        'no-restricted-syntax': OFF,
    },
    overrides: [
        {
            files: ['test/**/*.ts'],
            rules: {
                'import/prefer-default-export': OFF,
            },
        },
        {
            files: ['build/**/*.ts'],
            rules: {
                'import/no-extraneous-dependencies': OFF,
            },
        },
    ],
};
