import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';

import { join } from 'path';

const DIST = './dist';
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
      targets: [
        {
          src: ['index.css', 'index.html'],
          dest: DIST,
        },
        {
          src: ['assets/favicon/', 'assets/cards.svg'],
          dest: DIST + '/assets',
        },
      ],
    }),
  ],
};
