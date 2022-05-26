import {
  readdir,
  readFile,
  appendFile,
  open,
  copyFile,
} from 'node:fs/promises';

import { extname } from 'node:path';

const CARDS_SVG = 'cards.svg';
const CARDS_HTML = 'cards.html';
const BASE_SVG = 'base.svg';

const svgRegexp = new RegExp(
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" face="\\w+" height="3.5in" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="2.5in">'
);

const cardFrame =
  '<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>';

await copyFile(BASE_SVG, CARDS_SVG);
const svgFile = await open(CARDS_SVG, 'a');
const files = (await readdir('.')).filter(
  (file) =>
    extname(file) === '.svg' &&
    ![
      CARDS_SVG,
      'hueco.svg',
      '1B.svg',
      '2B.svg',
      '1J.svg',
      '2J.svg',
      'cairo-bloque.svg',
      '3B.svg',
      'base.svg',
    ].includes(file)
);

for (const file of files) {
  console.log(file);
  const id = file.replace('.svg', '');
  const [carta, palo] = id;
  const color = 'HD'.includes(palo) ? 'red' : 'black';
  const svg = await readFile(file, 'utf8');
  await svgFile.appendFile(
    svg
      .replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '')
      .replaceAll('xlink:href="', 'href="')
      .replace(
        svgRegexp,
        `<symbol id="card_${id}"  height="3.5in" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="2.5in">`
      )
      .replace('</svg>', '</symbol>\n')
      .replaceAll(cardFrame, '<use href="#card_frame" x="-120" y="-168" />')

      .replaceAll(
        new RegExp(`href="#S${palo}${carta}"`, 'g'),
        `href="#palo_${palo}"`
      )
      .replaceAll(
        new RegExp(`href="#V${palo}${carta}"`, 'g'),
        `href="#carta_${carta}"`
      )
      .replaceAll(
        new RegExp(`<symbol\\s+id="[VS]${palo}${carta}".*?(<\\/symbol>)`, 'g'),
        ''
      )
  );
}

await svgFile.appendFile('</svg>');
await svgFile.close();
await copyFile(CARDS_SVG, CARDS_HTML);
await appendFile(
  CARDS_HTML,
  `<svg xmlns="http://www.w3.org/2000/svg" width="100%" preserveAspectRadio="none" viewBox="0 0 800 3000" style="background-color: darkgreen;">
  <use href="#card_hueco" width="100" height="140" x="240" y="10"/>
  <use href="#card_back" width="100" height="140" x="360" y="50"/>

  ${files
    .map(
      (file, index) =>
        `<use href="#card_${file.replace(
          '.svg',
          ''
        )}" width="100" height="140" x="${(index % 4) * 120}" y="${
          index * 40 + 90
        }"/>`
    )
    .join('\n')}</svg>`
);
