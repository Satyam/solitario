const CICLOS = 4;
const PORC_ANCHO = 0.1;
const PI_4 = Math.PI / 4;
const COS_PI_4 = Math.cos(PI_4);
const NS_SVG = 'http://www.w3.org/2000/svg';
const CLASSNAMES = ['uno', 'dos', 'tres', 'cuatro'];

const createSvgPath = (points, className = '') => {
  const newEl = document.createElementNS(NS_SVG, 'path'); //Create a path in SVG's namespace
  const { p0, p1, cp0, cp1 } = points;
  newEl.setAttribute(
    'd',
    `M ${p0.join(',')} C ${cp0.join(',')} ${cp1.join(',')} ${p1.join(',')}`
  );
  newEl.setAttribute('class', className);
  return newEl;
};

const createSvgCircle = (x, y, title = '') => {
  const newEl = document.createElementNS(NS_SVG, 'circle');
  newEl.setAttribute('cx', x);
  newEl.setAttribute('cy', y);
  newEl.setAttribute('r', 3);
  const titleEl = document.createElementNS(NS_SVG, 'title');
  titleEl.appendChild(document.createTextNode(title));
  newEl.appendChild(titleEl);
  return newEl;
};

const redraw = () => {
  const svgEl = document.getElementById('svg');

  const svg = svgEl.getBoundingClientRect();

  const [minX, minY, width, height] = svgEl
    .getAttribute('viewBox')
    .split(' ')
    .map(Number);

  const mouseToXy = (ev) => [
    Math.round(((ev.pageX - svg.left) * width) / svg.width + minX),
    Math.round(((ev.pageY - svg.top) * height) / svg.height + minY),
  ];

  const yMax = height * PORC_ANCHO;
  const longitudDeOnda = width / CICLOS;
  const step = longitudDeOnda / 4;
  const cp_stretch = longitudDeOnda / 8;
  const cp_stretch_45 = Math.round(cp_stretch * COS_PI_4);

  const puntos = [
    { x: 0, y: 0, cpx: cp_stretch_45, cpy: -cp_stretch_45 },
    { x: step, y: -yMax, cpx: cp_stretch, cpy: 0 },
    {
      x: 2 * step,
      y: 0,
      cpx: cp_stretch_45,
      cpy: cp_stretch_45,
    },
    { x: 3 * step, y: yMax, cpx: cp_stretch, cpy: 0 },
    {
      x: 4 * step,
      y: 0,
      cpx: cp_stretch_45,
      cpy: -cp_stretch_45,
    },
  ];

  const draw = (mX = 0, mY = 0) => {
    for (let ciclo = 0; ciclo < CICLOS; ciclo++) {
      const baseX = ciclo * longitudDeOnda;
      for (let fase = 0; fase < 3; fase++) {
        const fx = Math.round((longitudDeOnda * fase) / 3);
        for (let seg = 0; seg < 4; seg++) {
          const offsetX = baseX + fx;
          const punto = puntos[seg];
          const next = puntos[seg + 1];
          const pX = punto.x + offsetX;
          const nX = next.x + offsetX;
          const offsetpY = Math.max(
            Math.min(Math.max(2 * step - Math.abs(mX - pX), 0) * mY, 2 * yMax),
            -2 * yMax
          );
          const offsetnY = Math.max(
            Math.min(Math.max(2 * step - Math.abs(mX - nX), 0) * mY, 2 * yMax),
            -2 * yMax
          );
          svgEl.appendChild(
            createSvgPath(
              {
                p0: [pX, punto.y - offsetpY],
                p1: [nX, next.y - offsetnY],
                cp0: [punto.cpx + pX, punto.cpy + punto.y - offsetpY],
                cp1: [-next.cpx + nX, -next.cpy + next.y - offsetnY],
              },
              CLASSNAMES[fase % CLASSNAMES.length]
            )
          );
          if (fase === 0) {
            svgEl.appendChild(createSvgCircle(pX, offsetpY), 'p0');
            svgEl.appendChild(createSvgCircle(nX, offsetnY), 'p1');
          }
        }
      }
    }
  };

  const removeAll = () => {
    while (svgEl.firstChild) {
      svgEl.removeChild(svgEl.firstChild);
    }
  };

  draw();

  const mouseOnHandler = (ev) => {
    if (ev.buttons === 0) return;
    ev.preventDefault();
    const [mX, mY] = mouseToXy(ev);
    removeAll();
    draw(mX, mY);
  };

  const mouseOffHandler = (ev) => {
    ev.preventDefault();
    removeAll();
    draw(0, 0);
  };

  window.onmousemove = mouseOnHandler;
  window.onmousedown = mouseOnHandler;
  window.onmouseup = mouseOffHandler;
};

window.onresize = redraw;
window.onload = redraw;
