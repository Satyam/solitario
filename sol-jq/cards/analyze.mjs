import { readdir, readFile } from 'node:fs/promises';
import { extname } from 'node:path';

function tagRexp(tag, global) {
  return new RegExp(
    `<${tag}(?<attrs>(?:\\s+\\w+(?:\\:\\w+)?="[^"]*")*\\s*)>(?<innerHTML>.*?)<\\/${tag}>`,
    //      1        2        3           3         2     1 1               1
    global ? 'g' : ''
  );
}
// const svgRexp = /<svg(\s+(\w+(\:\w+)?)=(("[^"]*")|\S+))*\s*>/;
// const symbolRexp =
// /<symbol(?<attrs>(\s+\w+(\:\w+)?="[^"]*")*)\s*>(?<innerHTML>.*?)<\/symbol>/g;
const svgRexp = tagRexp('svg');
const symbolRexp = tagRexp('symbol', true);
const attrRexp = /(?<name>\w+(\:\w+)?)="(?<val>[^"]*)"/g;
const svgAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  class: 'card',
  height: '3.5in',
  preserveAspectRatio: 'none',
  viewBox: '-120 -168 240 336',
  width: '2.5in',
};

const symbolAttrs = {
  S: {
    viewBox: '-600 -600 1200 1200',
    preserveAspectRatio: 'xMinYMid',
  },
  V: {
    viewBox: '-500 -500 1000 1000',
    preserveAspectRatio: 'xMinYMid',
  },
};

const symbolContents = {};

function readAttrs(s) {
  const attrs = {};
  for (const attr of s.matchAll(attrRexp)) {
    const { name, val } = attr.groups;
    attrs[name] = val;
  }
  return attrs;
}

try {
  const files = await readdir('.');
  for (const file of files) {
    if (
      extname(file) === '.svg' &&
      !['cards.svg', 'hueco.svg', '1B.svg', '1J.svg', '2J.svg'].includes(file)
    ) {
      const svg = await readFile(file, 'utf8');
      const m = svg.match(svgRexp);
      if (m) {
        console.log('--------------------', file);
        const { face, ...attrs } = readAttrs(m.groups.attrs);
        if (face !== file.replace('.svg', '')) {
          console.error(file, '!!!face', face);
        }
        for (const name in attrs) {
          if (attrs[name] !== svgAttrs[name]) {
            console.error(
              file,
              '!!svg attr',
              name,
              attrs[name],
              svgAttrs[name]
            );
          }
        }
      } else {
        console.error(file, '!!!! no svg');
      }
      for (const m of svg.matchAll(symbolRexp)) {
        if (m.groups.attrs) {
          const { id, ...attrs } = readAttrs(m.groups.attrs);
          if (id) {
            const kind = id.charAt(0);
            if (!'SV'.includes(kind)) {
              console.error(file, '!!!no S or V', id);
              break;
            }
            for (const name in attrs) {
              if (attrs[name] !== symbolAttrs[kind][name]) {
                console.error(
                  file,
                  '!!! symbol',
                  id,
                  'attr',
                  name,
                  kind,
                  attrs[name],
                  symbolAttrs[kind][name]
                );
              }
            }
            if (id.startsWith('S')) {
              const code = 'S' + id.charAt(1);
              if (symbolContents[code]) {
                if (symbolContents[code].svg !== m.groups.innerHTML) {
                  console.error(
                    file,
                    'content',
                    code,
                    symbolContents[code].svg.substring(0, 40),
                    m.groups.innerHTML.substring(0, 40)
                  );
                } else {
                  symbolContents[code][id] = file;
                  symbolContents[code][`a${id}`] = attrs;
                }
              } else {
                symbolContents[code] = {
                  svg: m.groups.innerHTML,
                  [id]: [file],
                  [`a${id}`]: attrs,
                };
              }
            }
            if (id.startsWith('V')) {
              const code = 'V' + id.charAt(2);
              const chopFill = m.groups.innerHTML
                .replace('stroke="black"', '')
                .replace('stroke="red"', '');
              if (symbolContents[code]) {
                if (symbolContents[code].svg !== chopFill) {
                  console.error(
                    file,
                    'content',
                    code,
                    symbolContents[code].svg.substring(0, 40),
                    m.groups.innerHTML.substring(0, 40)
                  );
                } else {
                  symbolContents[code][id] = file;
                  symbolContents[code][`a${id}`] = attrs;
                }
              } else {
                symbolContents[code] = {
                  svg: chopFill,
                  [id]: [file],
                  [`a${id}`]: attrs,
                };
              }
            }
          } else {
            console.error(file, '!!no id', attrs);
          }
        } else {
          console.error(
            file,
            '!!! no attrs',
            JSON.stringify(m.groups, null, 2)
          );
        }
      }

      if (
        !svg.includes(
          '<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>'
        )
      ) {
        console.error(file, '!!! no rect');
      }
    }
  }
  console.log(JSON.stringify(symbolContents, null, 2));
} catch (err) {
  console.error(err);
}
