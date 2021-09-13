const NUM_STEPS = 8;
const FULL_TURN = 2 * Math.PI;
const STEP = FULL_TURN / NUM_STEPS;

const angles = Array(NUM_STEPS)
  .fill(0)
  .map((_, i) => i * STEP);

const regex =
  /^M\s+(-?\d+,-?\d+)\s+C\s+(-?\d+,-?\d+)\s+(-?\d+,-?\d+)\s+(-?\d+,-?\d+)$/g;

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

  const shortest = Math.min(vb.height / 2, vb.width / 2);

  const polarToXY = (distance, angle) => [
    Math.round(distance * Math.cos(angle)),
    Math.round(distance * Math.sin(angle)),
  ];

  const mouseToXy = (ev) => [
    Math.round(((ev.pageX - svg.left) * vb.width) / svg.width + vb.minX),
    Math.round(((ev.pageY - svg.top) * vb.height) / svg.height + vb.minY),
  ];

  document.getElementById('g').innerHTML = angles
    .map((angle, index) => {
      const [x0, y0] = polarToXY(shortest * 0.1, angle);
      const [xc0, yc0] = polarToXY(shortest * 0.2, angle);
      const [x1, y1] = polarToXY(shortest, angle);
      const [xc1, yc1] = polarToXY(shortest * 0.9, angle);

      return `
        <path 
          class="spline" 
          id="p${index}"
          d="M ${x0},${y0} C ${xc0},${yc0} ${xc1},${yc1} ${x1},${y1}"
        />
        <line class="linea" id="l${index}" x1=${x0} y1=${y0} x2=${x0} y2=${y0} />`;
    })
    .join(' ');

  const mouseHandler = (ev) => {
    if (ev.buttons === 0) return;
    ev.preventDefault();
    const [x, y] = mouseToXy(ev);
    const circle = document.getElementById('c');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    for (let index = 0; index < NUM_STEPS; index += 1) {
      const path = document.getElementById(`p${index}`);
      const linea = document.getElementById(`l${index}`);

      switch (ev.buttons) {
        case 1:
          {
            const [x0, y0] = polarToXY(shortest * 0.1, angles[index]);
            path.setAttribute(
              'd',
              path
                .getAttribute('d')
                .replace(regex, `M ${x + x0},${y + y0} C $2 $3 $4`)
            );

            const [x1, y1] = polarToXY(shortest * 0.1, angles[index]);
            linea.setAttribute('x1', x + x1);
            linea.setAttribute('y1', y + y1);
          }

          break;
        case 4:
          {
            const [x0, y0] = polarToXY(
              shortest * 0.9,
              angles[index] - STEP * (y / shortest)
            );
            const [x1, y1] = polarToXY(
              shortest,
              angles[index] + STEP * (x / shortest)
            );
            path.setAttribute(
              'd',
              path
                .getAttribute('d')
                .replace(regex, `M $1 C $2 ${x0},${y0} ${x1},${y1}`)
            );
          }

          break;
        default:
          break;
      }
    }
  };

  window.addEventListener('mousemove', mouseHandler);
  window.addEventListener('mousedown', mouseHandler);
};
