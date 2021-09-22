const NS_SVG = 'http://www.w3.org/2000/svg';
const PI_4 = Math.PI / 4;
const COS_PI_4 = Math.cos(PI_4);
const SIN_PI_4 = Math.sin(PI_4);
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
const redraw = () => {
  const svgEl = document.getElementById('svg');

  const svgBox = svgEl.getBoundingClientRect();

  const [minX, minY, width, height] = svgEl
    .getAttribute('viewBox')
    .split(' ')
    .map(Number);

  const mouseToXy = (ev) => [
    Math.round(((ev.pageX - svgBox.left) * width) / svgBox.width + minX),
    Math.round(((ev.pageY - svgBox.top) * height) / svgBox.height + minY),
  ];

  svgEl.appendChild(
    _(
      'clipPath',
      { id: 'sixth' },
      _('polygon', {
        points: stringOfPoints([
          [0, 0],
          [100, 0],
          [100 * COS_PI_4, 100 * SIN_PI_4],
        ]),
      })
    )
  );
  svgEl.appendChild(
    _('defs', {}, [
      _('g', { id: 'g' }, [
        _('rect', {
          x: 20,
          y: 5,
          width: 80,
          height: 20,
          fill: 'blue',
        }),
        _('circle', {
          cx: 50,
          cy: 30,
          r: 10,
          fill: 'red',
        }),
      ]),
    ])
  );
  for (let angle = 0; angle < 360; angle += 60) {
    svgEl.appendChild(
      _('use', {
        href: '#g',
        'clip-path': 'url(#sixth)',
        transform: `rotate(${angle})`,
      })
    );
  }
};

window.onresize = redraw;
window.onload = redraw;
