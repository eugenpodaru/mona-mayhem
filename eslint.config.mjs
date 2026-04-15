import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sharedStyleRules = {
	curly: ['error', 'all'],
	eqeqeq: ['error', 'always'],
	'no-trailing-spaces': 'error',
	'object-shorthand': ['error', 'always'],
	quotes: ['error', 'single', { avoidEscape: true }],
	semi: ['error', 'always'],
};

export default [
	{
		ignores: ['.astro/**', 'dist/**', 'node_modules/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			...sharedStyleRules,
			'@typescript-eslint/no-unused-vars': 'off',
			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		files: ['**/*.{ts,tsx,astro}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			...sharedStyleRules,
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},
];
