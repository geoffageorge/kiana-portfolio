import { assetUrl } from '../../lib/urls.js';

// Original SVG layers from Figma logo 187:8, at their measured positions.
const shapes = [
  ['vector-164.svg', 3.13715, 1.66014, 17, 17],
  ['vector-165.svg', 20.9586, 1.66014, 17, 17],
  ['vector-166.svg', 20.9586, 19.3666, 17, 17],
  ['vector-167.svg', 38.5862, 19.3692, 17, 17],
  ['vector-168.svg', 3.13715, 19.3666, 17, 17],
  ['vector-169.svg', 37.4785, 9.16133, 18, 9],
];
export default function PointlyMark() {
  return <span className="pointly-mark" aria-hidden="true" data-figma-node="187:8">{shapes.map(([file, left, top, width, height]) => <img key={file} src={assetUrl(`pointly-figma/${file}`)} alt="" width={width} height={height} style={{ left, top }} />)}</span>;
}
