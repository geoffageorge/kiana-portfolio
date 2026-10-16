import { useEffect, useState } from 'react';
import manifest from '../../public/assets/obayashi/manifest.json';
import { assetUrl, projectUrl, siteUrl } from '../lib/urls.js';
import './ObayashiCaseStudyPage.css';

const sections = [['challenge', 'The Challenge'], ['research', 'Research'], ['design', 'Design'], ['reflection', 'Reflection']];
const challenges = [
  ['Key audiences lacked clear pathways to the information they needed.', 'The site contained valuable content, but navigation did not prioritize prospective clients and employees, making important information difficult to find quickly.'],
  ['The North American site felt disconnected from a strong global brand.', 'It had developed its own look and feel rather than leveraging Obayashi’s established global identity. The relationship between the North American and global organizations was also unclear, particularly when users moved between the two sites.'],
  ['Internal priorities had not been translated into a clear external hierarchy', 'HR, Engineering, Safety, Operations, IT, and leadership each had different priorities for the site. The challenge was determining which messages mattered most to the business and its audiences.'],
  ['The digital experience did not reflect the sophistication of the work', 'Obayashi delivers large-scale projects requiring precision, coordination, and technical expertise. A fragmented digital experience risked communicating the opposite.'],
];
const findings = [
  {
    title: 'Two audiences had an outsized impact on business goals',
    text: 'Prospective clients and prospective employees emerged as the highest-priority users. One supported the revenue pipeline; the other supported Obayashi’s ability to attract high-quality talent.',
    asset: 'audience-priorities',
    alt: 'Existing Obayashi contact and careers pages with research annotations',
    notes: 'Opportunities to better support client inquiries and showcase value. Reimagine the career experience to attract top talent.',
  },
  {
    title: 'For prospective clients, the project portfolio was the proof.',
    text: 'Visitors needed evidence of Obayashi’s capabilities, not simply descriptions of them. Yet major projects were difficult to discover, and case studies lacked useful details such as scope, technology, budget, and duration.',
    asset: 'portfolio-evidence',
    alt: 'Obayashi project listing and case-study screens with research annotations',
    notes: 'Projects showcased Japan’s main projects and North American projects were difficult to find. Case studies lacked key details.',
  },
  {
    title: 'Some of Obayashi’s strongest credibility signals were also its least visible',
    text: 'An established global brand and portfolio of notable projects could immediately build confidence, yet both were underleveraged within the North American experience.',
    asset: 'credibility-signals',
    alt: 'Featured Obayashi infrastructure projects with a research annotation',
    notes: 'North American projects demonstrated Obayashi’s expertise, but lacked compelling presentation and detailed project information to communicate their full impact.',
  },
  {
    title: 'For candidates, the website was part of the employer experience',
    text: 'Prospective employees had limited visibility into culture, benefits, programs, and employee perspectives. The dated experience also created a disconnect between the sophistication of Obayashi’s work and the company candidates encountered online.',
    asset: 'employer-experience',
    alt: 'Original Obayashi company introduction with an employer-experience annotation',
    notes: 'Generic company messaging and limited employee-focused content offered candidates little insight into workplace culture, benefits, or career opportunities.',
  },
  {
    title: 'Content hierarchy needed to reflect business value, not internal ownership.',
    text: 'The goal was not to give every department equal prominence. It was to determine which information best supported user decisions and the company’s larger objectives.',
    asset: 'content-hierarchy',
    alt: 'Obayashi website content mind map with a prioritized content opportunity',
    notes: 'OPPORTUNITY → Prioritize content based on audience needs and business goals, not departmental ownership.',
  },
];

function Exhibit({ name, alt, caption, onOpenImage, eager = false }) {
  const asset = manifest.assets[name];
  const image = { src: assetUrl(`obayashi/${asset.file}`), alt, width: asset.width, height: asset.height, caption };
  return <figure className="obayashi-exhibit">
    <button type="button" onClick={() => onOpenImage(image)} aria-label={`Enlarge ${alt}`}>
      <img src={image.src} alt={alt} width={asset.width} height={asset.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </button>
    {caption && <figcaption className="sr-only">{caption}</figcaption>}
  </figure>;
}

export default function ObayashiCaseStudyPage({ onOpenImage }) {
  const [active, setActive] = useState('challenge');
  useEffect(() => {
    document.title = 'Obayashi / Kiana George';
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -60% 0px' });
    for (const [id] of sections) observer.observe(document.getElementById(id));
    return () => observer.disconnect();
  }, []);

  return <article className="obayashi-case">
    <header className="obayashi-intro">
      <div><p className="obayashi-index">02 /</p><h1>Obayashi</h1></div>
      <p className="obayashi-intro__summary">Aligning Teams, Audiences, and Priorities<br className="obayashi-desktop-break" /> Into a Unified Experience</p>
    </header>
    <dl className="obayashi-facts">
      {[
        ['Deliverable', ['36-page website redesign and internal handoff']],
        ['Timeline', ['12 months']],
        ['My contribution', ['Website Design and UX research']],
        ['Process', ['Stakeholder Interviews', 'Competitive Analysis', 'Content Audit', 'Information Architecture']],
        ['Methods', ['Interviews']],
        ['Tools', ['Figma', 'Wix', 'Claude', 'Mobirise']],
      ].map(([label, lines]) => <div key={label}><dt>{label}</dt><dd>{lines.map(line => <span key={line}>{line}</span>)}</dd></div>)}
    </dl>
    <p className="obayashi-summary">Obayashi North America had a website, but it lacked a clear digital story. I translated input from 17 stakeholders into new information architecture, content strategy, and a 36-page website redesign.</p>

    <div className="obayashi-method-layout">
      <nav className="obayashi-methodology" aria-label="Project sections">
        {sections.map(([id, title]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{title}</a>)}
      </nav>
      <section id="challenge" className="obayashi-challenge" aria-labelledby="obayashi-challenge-title">
        <h2 id="obayashi-challenge-title">The Challenge</h2>
        <div>{challenges.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
      </section>
    </div>

    <section id="research" className="obayashi-research" aria-labelledby="obayashi-research-title">
      <div className="obayashi-research__overview">
        <div className="obayashi-research__intro">
          <p className="obayashi-label">Research</p>
          <h2 id="obayashi-research-title">17 stakeholder<br /> interviews</h2>
          <p>Actions and organizational functions</p>
          <ul>{['Engineering', 'HR', 'Safety', 'Operations', 'IT', 'Executive Leadership'].map(role => <li key={role}>{role}</li>)}</ul>
        </div>
        <div className="obayashi-research__evidence">
          <Exhibit name="stakeholder-interviews" alt="Collage of Obayashi stakeholder interview participants across organizational functions" onOpenImage={onOpenImage} eager />
          <figure className="obayashi-quote">
            <span className="obayashi-quote__mark" aria-hidden="true">“</span>
            <div><blockquote>“The website is often the <strong>first impression</strong> people have of <strong>Obayashi.</strong><br className="obayashi-desktop-break" /> It should reflect the scale of our work and the people behind it.”</blockquote>
              <figcaption>— Interview participant, Executive Leadership</figcaption></div>
          </figure>
        </div>
      </div>
      <div className="obayashi-findings">
        <h2>What the Research<br /> Revealed</h2>
        <ol>{findings.map(({ title, text, asset, alt, notes }, index) => <li key={asset} className="obayashi-finding">
          <div className="obayashi-finding__copy">
            <span className="obayashi-finding__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </div>
          <Exhibit name={asset} alt={alt} caption={notes} onOpenImage={onOpenImage} />
        </li>)}</ol>
      </div>
    </section>
    <section id="design" className="obayashi-empty-section" aria-labelledby="obayashi-design-title">
      <h2 id="obayashi-design-title">Design</h2>
    </section>
    <section id="reflection" className="obayashi-empty-section" aria-labelledby="obayashi-reflection-title">
      <h2 id="obayashi-reflection-title">Reflection</h2>
    </section>
    <div className="obayashi-end">
      <a href={`${siteUrl()}#work`}>Back to selected work <span aria-hidden="true">↗</span></a>
      <a href={projectUrl('pointly')}>Next project: Point.ly <span aria-hidden="true">↗</span></a>
    </div>
  </article>;
}
