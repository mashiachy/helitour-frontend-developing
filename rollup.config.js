import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import replace from "@rollup/plugin-replace";

export default {
  output: {
    file: 'app/js/bundle.js',
    format: 'es',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({
      mainFields: ['jsnext', 'main'],
      browser: true,
    }),
    commonjs(),
    globals(),
  ],
};