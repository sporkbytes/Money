import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';

export default {
	input: 'index.js',
	output: [
		{ file: pkg.main, format: 'cjs' },
		{ file: pkg.module, format: 'es' },
		{
			name: 'Money',
			file: pkg.umdModule,
			format: 'umd',
			globals: {
				'@sporkbytes/math-utils': 'mathUtils',
			},
		},
	],
	external: ['@sporkbytes/math-utils'],
	plugins: [
		babel({
			exclude: ['node_modules/**'],
		}),
		cleanup(),
	],
};
