import { about } from '../data/about.js';
import { assetUrl } from '../lib/urls.js';
import './AboutPage.css';

const asset = file => assetUrl(`website-v2-figma/${file}`);

export default function AboutPage({ site }) {
  return (
    <article className="about-page" data-figma-node="522:265">
      <div className="about-page__story">
        <p className="about-page__eyebrow" data-figma-node="522:277">ABOUT</p>
        <h1 data-figma-node="522:268">{about.heading}</h1>
        <div className="about-page__copy" data-figma-node="522:266">{about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="about-page__actions">
          <a className="about-page__button about-page__button--resume" href={site.resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Resume (PDF, opens in a new tab)">
            <img src={asset('resume-button.svg')} alt="" width="99" height="31" aria-hidden="true" data-figma-node="522:271" />
            <span data-figma-node="522:273">RESUME <span aria-hidden="true">↗</span></span>
          </a>
          <a className="about-page__button about-page__button--linkedin" href={site.linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" data-figma-node="522:270"><span data-figma-node="522:272">LINKEDIN <span aria-hidden="true">↗</span></span></a>
        </div>
        <section className="about-page__contact" aria-labelledby="about-contact-title">
          <h2 id="about-contact-title" data-figma-node="522:269">Let’s Connect</h2>
          <address data-figma-node="522:267">
            <div><p>EMAIL</p><a href={`mailto:${site.email}`}>{site.email}</a></div>
            <div><p>PHONE</p><a className="about-page__phone" href={site.phoneUrl}>{site.phone}</a></div>
          </address>
        </section>
      </div>
      <figure className="about-page__portrait" data-figma-node="522:274" style={{ maskImage: `url("${asset('portrait-mask.svg')}")` }}>
        <div className="about-page__portrait-rotation">
          <div className="about-page__portrait-source" data-figma-node="522:276">
            <img src={asset('portrait.png')} alt="Kiana George" width="1179" height="1334" decoding="async" />
          </div>
        </div>
      </figure>
    </article>
  );
}
