import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';

import { join } from 'path';

const PUBLIC = './public';
const ASSETS = 'assets';
export default {
  input: 'src/index.ts',
  output: {
    dir: PUBLIC,
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    clear({
      targets: [PUBLIC],
    }),
    resolve(),
    typescript(),
    copy({
      targets: [
        {
          src: 'cards/cards.svg',
          dest: join(PUBLIC, ASSETS),
        },
        { src: ['src/index.css', 'src/index.html', ASSETS], dest: PUBLIC },
      ],
    }),
  ],
};
