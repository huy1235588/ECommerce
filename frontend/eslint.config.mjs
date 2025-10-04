import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
            'dist/**',
            '*.config.js',
            '*.config.ts',
            '*.config.mjs',
        ],
    },
    {
        rules: {
            // Prettier integration
            'prettier/prettier': 'off', // Handled by prettier separately

            // Code quality
            'no-console': 'warn',
            'no-debugger': 'warn',
            'no-unused-vars': 'warn',

            // JSX specific
            'no-unescaped-entities': 'off',
            'react/no-unescaped-entities': 'off',

            // React specific
            'react/prop-types': 'off', // TypeScript handles this
            'react/react-in-jsx-scope': 'off', // Not needed in Next.js
            'react/jsx-uses-react': 'off',
            'react/jsx-uses-vars': 'error',

            // Import order
            // 'import/order': [
            //     'error',
            //     {
            //         groups: [
            //             'builtin',
            //             'external',
            //             'internal',
            //             'parent',
            //             'sibling',
            //             'index',
            //         ],
            //         alphabetize: {
            //             order: 'asc',
            //             caseInsensitive: true,
            //         },
            //     },
            // ],

            // TypeScript
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-object-type': 'off',
        },
    },
];

export default eslintConfig;
