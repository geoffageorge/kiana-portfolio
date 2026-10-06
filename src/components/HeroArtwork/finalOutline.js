// Native SVG replaces the absolutely positioned HTML inside foreignObject.
// Small arcs approximate the original conic gradient without HTML layers that
// Safari can position outside the SVG.
const stops = [
  [0, '#9cbabc'], [55, '#9cbabc'], [96, '#e5ef18'], [163, '#e5ef18'],
  [205, '#afddb1'], [236, '#afddb1'], [278, '#5fd1d3'], [319, '#5fd1d3'], [360, '#9cbabc'],
];
const rgb = hex => [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16));
function colorAt(angle) {
  const end = stops.findIndex(stop => stop[0] >= angle);
  const [leftAngle, leftColor] = stops[Math.max(0, end - 1)];
  const [rightAngle, rightColor] = stops[end];
  const amount = rightAngle === leftAngle ? 0 : (angle - leftAngle) / (rightAngle - leftAngle);
  const left = rgb(leftColor), right = rgb(rightColor);
  return `rgb(${left.map((value, index) => Math.round(value + (right[index] - value) * amount)).join(' ')})`;
}
const point = (angle, radius) => {
  const radians = (angle - 90) * Math.PI / 180;
  return `${600 + radius * Math.cos(radians)} ${450 + radius * Math.sin(radians)}`;
};
export const finalOutline = Array.from({ length: 120 }, (_, index) => {
  const start = index * 3 - 37, end = start + 3.05;
  return {
    color: colorAt(index * 3 + 1.5),
    path: `M ${point(start, 138.5)} A 138.5 138.5 0 0 1 ${point(end, 138.5)}`,
  };
});
