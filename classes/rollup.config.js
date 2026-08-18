import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';

import { join } from 'path';

const DIST = './dist';
const ASSETS = 'assets';
export default {
  input: 'index.js',
  output: {
    dir: DIST,
    format: 'es',
  },
  plugins: [
    clear({
      targets: [DIST],
    }),
    resolve(),
    copy({
      targets: [{ src: ['index.css', 'index.html', ASSETS], dest: DIST }],
    }),
  ],
};
