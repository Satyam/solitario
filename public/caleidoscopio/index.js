const NS_SVG = 'http://www.w3.org/2000/svg';
// const ANG_45 = Math.PI / 4;
// const COS_45 = Math.cos(ANG_45);
// const SIN_45 = Math.sin(ANG_45);
const ANG_30 = Math.PI / 6;
const COS_30 = Math.cos(ANG_30);
const SIN_30 = Math.sin(ANG_30);

const COLORS = ['magenta', 'blue', 'yellow', 'green', 'cyan', 'red'];
const svgEl = document.getElementById('svg');

const randomInt = (max) => Math.floor(Math.random() * max);

const [minX, minY, width, height] = svgEl
  .getAttribute('viewBox')
  .split(' ')
  .map(Number);

const round = Math.round;
const R = round(Math.min(width, height) / 6);
const halfSide = R * COS_30;
const halfH = R * SIN_30;
const vertices = [
  [round(halfSide), round(halfH)],
  [0, -R],
  [-round(halfSide), round(halfH)],
];

const createSvgElement = (tag, attrs = {}, children = []) => {
  const newEl = document.createElementNS(NS_SVG, tag);
  for (const name in attrs) {
    newEl.setAttribute(name, attrs[name]);
  }

  switch (typeof children) {
    case 'undefined':
      break;
    case 'string':
      newEl.appendChild(document.createTextNode(children));
      break;
    case 'number':
    case 'boolean':
      newEl.appendChild(document.createTextNode(String(children)));
      break;
    default:
      if (!Array.isArray(children)) {
        children = [children];
      }
      children.forEach((child, index) => {
        if (child instanceof SVGElement) {
          newEl.appendChild(child);
        } else {
          console.error(
            `createSvgElement ${tag} has unsuported type of child at ${index}: ${child}`
          );
        }
      });
  }
  return newEl;
};

const _ = createSvgElement;

const stringOfPoints = (points) =>
  points.map((point) => point.join(',')).join(' ');

svgEl.appendChild(
  _(
    'clipPath',
    { id: 'sixth' },
    _('polygon', {
      points: stringOfPoints(vertices),
    })
  )
);

const patron = vertices.map((v, index) =>
  _('g', {}, [
    _('line', {
      x1: v[0],
      y1: v[1],
      x2: vertices[(index + 1) % 3][0],
      y2: vertices[(index + 1) % 3][1],
      stroke: 'black',
    }),
    _('line', {
      x1: 0,
      y1: 0,
      x2: (v[0] + vertices[(index + 1) % 3][0]) / 2,
      y2: (v[1] + vertices[(index + 1) % 3][1]) / 2,
      'stroke-width': 3,
      stroke: COLORS[index],
    }),
  ])
);

svgEl.appendChild(_('defs', {}, [_('g', { id: 'g' })]));

const randomEls = () => {
  const numEls = randomInt(10) + 1;
  const els = [];
  for (let i = 0; i < numEls; i++) {
    const fill = COLORS[randomInt(COLORS.length)];
    switch (randomInt(3)) {
      case 0:
        els.push(
          _('circle', {
            cx: randomInt(2 * R) - R,
            cy: randomInt(2 * R) - R,
            r: randomInt(R / 4),
            fill,
          })
        );
        break;
      case 1:
        els.push(
          _('rect', {
            x: randomInt(2 * R) - R,
            y: randomInt(2 * R) - R,
            width: randomInt(R / 2),
            height: randomInt(R / 2),
            fill,
          })
        );
        break;
      case 2:
        els.push(
          _('polygon', {
            points: `
            ${randomInt(2 * R) - R},${randomInt(2 * R) - R}
            ${randomInt(2 * R) - R},${randomInt(2 * R) - R}
            ${randomInt(2 * R) - R},${randomInt(2 * R) - R}
            `,
            fill,
          })
        );
        break;
      default:
        break;
    }
  }
  return els;
};
const redraw = () => {
  // const svgBox = svgEl.getBoundingClientRect();

  // const mouseToXy = (ev) => [
  //   Math.round(((ev.pageX - svgBox.left) * width) / svgBox.width + minX),
  //   Math.round(((ev.pageY - svgBox.top) * height) / svgBox.height + minY),
  // ];

  const diagSquared = (height * height + width * width) / 4;
  for (let row = -2; row < 3; row++) {
    const offsetX = (row & 1) * halfSide;
    const offsetY = row * (R + halfH);
    for (let col = -5; col < 5; col++) {
      const dx = round(offsetX + col * halfSide);
      const dy = round(offsetY + (col & 1) * (-R / 2));
      let transform = `
        translate(${dx},${dy})
        rotate(${180 * col})
      `;
      svgEl.appendChild(
        _('use', {
          href: '#g',
          'clip-path': 'url(#sixth)',
          transform,
          opacity: 1 - (dx * dx + dy * dy) / diagSquared,
        })
      );
      svgEl.appendChild(
        _(
          'text',
          {
            x: dx,
            y: dy,
          },
          `(${row},${col}: ${dx}, ${dy})`
        )
      );
    }
  }
};

const mousedownHandler = (ev) => {
  const g = svgEl.getElementById('g');
  switch (ev.buttons) {
    // case 1:
    //   g.replaceChildren();
    //   break;
    case 4:
      g.replaceChildren(...patron);
      break;
    default:
      g.replaceChildren(...randomEls());
      break;
  }
};
window.onresize = redraw;
window.onload = () => {
  svgEl.getElementById('g').replaceChildren(...patron);
  redraw();
};

window.onmousedown = mousedownHandler;
