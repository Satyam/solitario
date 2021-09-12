/* global $ */
const NUM_STEPS = 8;
const FULL_TURN = 2 * Math.PI;
const STEP = FULL_TURN / NUM_STEPS;
const MAX_RADIUS = 100;

const angles = Array(NUM_STEPS)
  .fill(0)
  .map((_, i) => i * STEP);

const rexp = /M\s+-?\d+,-?\d+\s+(.+)/;

export const main = () => {
  const svg = $('svg');
  const { left: svgLeft, top: svgTop } = svg.offset();
  const [minX, minY, vbWidth, vbHeight] = svg
    .attr('viewBox')
    .split(' ')
    .map(Number);

  const shortest = Math.min(vbHeight, vbWidth);

  const polarToXY = (distance, angle) => {
    const d = (distance / MAX_RADIUS) * shortest;
    return [Math.round(d * Math.cos(angle)), Math.round(d * Math.sin(angle))];
  };

  const mouseToXy = (ev) => [
    Math.round(((ev.pageX - svgLeft) * vbWidth) / svg.width() + minX),
    Math.round(((ev.pageY - svgTop) * vbHeight) / svg.height() + minY),
  ];

  $('#g').html(
    angles
      .map((angle, index) => {
        const [x0, y0] = polarToXY(MAX_RADIUS * 0.1, angle);
        const [xc0, yc0] = polarToXY(MAX_RADIUS * 0.2, angle);
        const [x1, y1] = polarToXY(MAX_RADIUS, angle);
        const [xc1, yc1] = polarToXY(MAX_RADIUS * 0.9, angle);

        return `<path class="pepe" id="p${index}"
          fill="none"
          stroke="green"
          d="M ${x0},${y0}
            C ${xc0},${yc0} ${xc1},${yc1} ${x1},${y1}"
        />`;
      })
      .join(' ')
  );

  $(window).on('mousemove mousedown', (ev) => {
    if (ev.buttons === 0) return;
    const [x, y] = mouseToXy(ev);
    $('.pepe').each(function (i) {
      const [x0, y0] = polarToXY(MAX_RADIUS * 0.1, angles[i]);
      $(this).attr('d', (_, val) =>
        val.replace(rexp, `M ${x + x0},${y + y0} $1`)
      );
    });
    $('#c').attr({
      cx: x,
      cy: y,
    });
  });
};
