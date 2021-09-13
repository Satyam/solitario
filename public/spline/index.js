const NUM_STEPS = 8;
const FULL_TURN = 2 * Math.PI;
const STEP = FULL_TURN / NUM_STEPS;
const MAX_RADIUS = 100;

const START_POINT_RADIUS = MAX_RADIUS * 0.1;
const START_CONTROL_POINT_RADIUS = MAX_RADIUS * 0.2;
const END_POINT_RADIUS = MAX_RADIUS;
const END_CONTROL_POINT_RADIUS = MAX_RADIUS * 0.9;

const angles = Array(NUM_STEPS)
  .fill(0)
  .map((_, i) => i * STEP);

const rexp = /M\s+-?\d+,-?\d+\s+(.+)/;

window.onload = () => {
  const svgEl = document.getElementById('svg');

  let svg = {};
  let vb = {};

  const resizeHandler = () => {
    svg = svgEl.getBoundingClientRect();
    const [minX, minY, width, height] = svgEl
      .getAttribute('viewBox')
      .split(' ')
      .map(Number);
    vb = {
      minX,
      minY,
      width,
      height,
    };
  };

  window.onresize = resizeHandler;

  resizeHandler();

  const shortest = Math.min(vb.height, vb.width);

  const polarToXY = (distance, angle) => {
    const d = (distance / MAX_RADIUS) * shortest;
    return [Math.round(d * Math.cos(angle)), Math.round(d * Math.sin(angle))];
  };

  const mouseToXy = (ev) => [
    Math.round(((ev.pageX - svg.left) * vb.width) / svg.width + vb.minX),
    Math.round(((ev.pageY - svg.top) * vb.height) / svg.height + vb.minY),
  ];

  document.getElementById('g').innerHTML = angles
    .map((angle, index) => {
      const [x0, y0] = polarToXY(START_POINT_RADIUS, angle);
      const [xc0, yc0] = polarToXY(START_CONTROL_POINT_RADIUS, angle);
      const [x1, y1] = polarToXY(END_POINT_RADIUS, angle);
      const [xc1, yc1] = polarToXY(END_CONTROL_POINT_RADIUS, angle);

      return `<path class="spline" id="p${index}"
          d="M ${x0},${y0}
            C ${xc0},${yc0} ${xc1},${yc1} ${x1},${y1}"
        />
        <line class="linea" id="l${index}" x1=${x0} y1=${y0} x2=${x0} y2=${y0} />`;
    })
    .join(' ');

  const mouseHandler = (ev) => {
    if (ev.buttons === 0) return;
    ev.preventDefault();

    const [x, y] = mouseToXy(ev);

    for (let index = 0; index < NUM_STEPS; index += 1) {
      const path = document.getElementById(`p${index}`);

      const [x0, y0] = polarToXY(START_POINT_RADIUS, angles[index]);
      path.setAttribute(
        'd',
        path.getAttribute('d').replace(rexp, `M ${x + x0},${y + y0} $1`)
      );

      const linea = document.getElementById(`l${index}`);
      const [x1, y1] = polarToXY(START_POINT_RADIUS, angles[index]);
      linea.setAttribute('x1', x + x1);
      linea.setAttribute('y1', y + y1);
    }
    const circle = document.getElementById('c');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
  };

  window.addEventListener('mousemove', mouseHandler);
  window.addEventListener('mousedown', mouseHandler);
};
