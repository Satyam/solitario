import {
  readdir,
  readFile,
  appendFile,
  open,
  copyFile,
  writeFile,
} from 'node:fs/promises';

import { extname, join } from 'node:path';

const CARDS_FOLDER = './cardSrc';
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
const files = (await readdir(CARDS_FOLDER)).filter(
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
  const svg = await readFile(join(CARDS_FOLDER, file), 'utf8');
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
        `href="#S${palo}"`
      )
      .replaceAll(
        new RegExp(`href="#V${palo}${carta}"`, 'g'),
        `href="#V${carta}" stroke="${color}"`
      )
      .replaceAll(
        new RegExp(`<symbol\\s+id="[VS]${palo}${carta}".*?(<\\/symbol>)`, 'gs'),
        ''
      )
      .replaceAll(
        new RegExp(
          ś`<defs><rect id="X${palo}${carta}" width="164.8" height="260.8" x="-82.4" y="-130.4"></rect></defs>`,
          'gs'
        ),
        ''
      )
      .replaceAll(
        new RegExp(
          `href="#X${palo}${carta}"\\s+stroke="#44F"\\s+fill="none"`,
          'gs'
        ),
        'href="#figure_frame" x="-120" y="-168" '
      )
  );
}

await svgFile.appendFile('</svg>');
await svgFile.close();

const svg = await readFile(CARDS_SVG, 'utf8');

await writeFile(
  CARDS_HTML,
  `
<!doctype html>
<html  lang="en">
  <head>
    <meta charset="utf-8">
    <title>Solitario</title>
  </head>
  <body>
    ${svg.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '')}
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 800 3000" style="background-color: darkgreen;">
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
    .join('\n')}
    </svg>
  </body>
  </html>`
);
