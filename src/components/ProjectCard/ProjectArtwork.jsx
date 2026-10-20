import { assetUrl } from '../../lib/urls.js';

const image = (file) => assetUrl(`home-figma/${file}`);

// Preserve the Figma source photograph and separate laptop/screen layers.
export default function ProjectArtwork({ variant }) {
  if (variant === 'obayashi') return (
    <div className="project-artwork project-artwork--obayashi" data-figma-node="499:35" style={{ maskImage: `url("${image('img-slide61.svg')}")` }}>
      <div className="project-artwork__staircase" data-figma-node="499:22">
        <img src={image('img-slide62.png')} alt="Spiral staircase in an Obayashi building" width="1143" height="624" loading="lazy" decoding="async" />
      </div>
    </div>
  );

  return (
    <div className="project-artwork project-artwork--pointly" data-figma-node="499:24">
      <div className="project-artwork__laptop-crop" data-figma-node="499:47" style={{ maskImage: `url("${image('apple-intelligence-bqi8-tl754-cfm-large2-x2.svg')}")` }}>
        <img className="project-artwork__laptop" src={image('apple-intelligence-bqi8-tl754-cfm-large2-x3.png')} alt="" width="1964" height="1196" loading="lazy" decoding="async" data-figma-node="499:43" />
        <div className="project-artwork__screen-crop" data-figma-node="499:45" style={{ maskImage: `url("${image('frame321.svg')}")` }}>
          <img className="project-artwork__screen" src={image('frame322.png')} alt="Point.ly travel booking website displayed on a laptop" width="1437" height="2349" loading="lazy" decoding="async" data-figma-node="499:42" />
        </div>
      </div>
    </div>
  );
}
