import { useEffect, useState } from 'react';
import manifest from '../../public/assets/obayashi-figma/manifest.json';
import { assetUrl, projectUrl, siteUrl } from '../lib/urls.js';
import CareersLaptop from '../components/CareersLaptop/CareersLaptop.jsx';
import './ObayashiCaseStudyPage.css';

const sections = [['competitive-analysis', 'Competitive Analysis'], ['web-audit', 'Web Audit'], ['priorities', 'Priorities'], ['brand-narrative', 'Brand Narrative'], ['site-design', 'Site Design'], ['retrospective', 'Retrospective']];
const src = name => assetUrl(`obayashi-figma/${manifest.assets[name].file}`);
const text = id => manifest.texts[id].text.trim().replace(/\u2028/g, '\n');

function Copy({ id, as: Tag = 'p', className = '' }) {
  const node = manifest.texts[id];
  return <Tag className={className} data-figma-node={id}>{node.segments.map(([start, end, style], index) => {
    let value = node.text.slice(start, end).replace(/\u2028/g, '\n');
    if (index === node.segments.length - 1) value = value.trimEnd();
    return manifest.textStyles[style].weight >= 700
      ? <strong key={start}>{value}</strong> : <span key={start}>{value}</span>;
  })}</Tag>;
}

function Rule({ details = false }) {
  const name = details ? 'details-divider' : 'section-divider';
  return <div className="obayashi-rule" aria-hidden="true"><img src={src(name)} alt="" /></div>;
}

function layerStyle(rect, width, height) {
  return { left: `${rect.x / width * 100}%`, top: `${rect.y / height * 100}%`, width: `${rect.width / width * 100}%`, height: `${rect.height / height * 100}%` };
}

function Exhibit({ name, alt, cropName = name, slotId, className = '', onOpenImage, caption, captionId, eager = false }) {
  const asset = manifest.assets[name];
  const crop = manifest.crops[cropName];
  const slot = slotId ? manifest.slots[slotId] : asset.slot;
  const width = crop?.width ?? slot?.width ?? asset.width;
  const height = crop?.height ?? slot?.height ?? asset.height;
  const imageRect = crop?.image ?? { x: 0, y: 0, width, height };
  const inner = crop?.inner;
  const transform = asset.imagePaint?.scaleMode === 'CROP' ? asset.imagePaint.imageTransform : null;
  const paintStyle = transform ? { position: 'absolute', width: `${100 / transform[0][0]}%`, height: `${100 / transform[1][1]}%`, left: `${-transform[0][2] / transform[0][0] * 100}%`, top: `${-transform[1][2] / transform[1][1] * 100}%`, objectFit: 'fill' } : undefined;
  const picture = <span className="obayashi-image-layer" data-figma-node={slotId ?? asset.figmaNodeIds[0]} style={layerStyle(imageRect, inner?.width ?? width, inner?.height ?? height)}>
    <img src={src(name)} alt={alt} width={asset.width} height={asset.height} loading={eager ? 'eager' : 'lazy'} decoding="async" data-figma-asset={name} style={paintStyle} />
  </span>;
  return <figure className={`obayashi-exhibit ${className}`}>
    <button type="button" aria-label={`Enlarge ${alt}`} onClick={() => onOpenImage({ ...asset, src: src(name), alt, caption: captionId ? text(captionId).replace(/\n/g, ' ') : caption })}>
      <span className="obayashi-image-viewport" data-figma-slot={crop?.nodeId ?? slotId ?? asset.figmaNodeIds[0]} style={{ aspectRatio: `${width} / ${height}`, ...(crop && { maskImage: `url("${src(crop.mask)}")` }) }}>
        {inner ? <span className="obayashi-image-clip" style={{ ...layerStyle(inner, width, height), maskImage: `url("${src(inner.mask)}")` }}>{picture}</span> : picture}
      </span>
    </button>
    {captionId ? <Copy id={captionId} as="figcaption" /> : caption && <figcaption>{caption}</figcaption>}
  </figure>;
}

const audit = [
  ['420:390', '420:394', 'existing-projects', 'Existing Obayashi global project listing', '420:392'],
  ['420:395', '420:396', 'existing-project-detail', 'Existing Obayashi project detail with limited supporting information', '420:397'],
  ['266:15', '266:17', 'existing-contact', 'Existing Obayashi contact page without an inquiry form', '420:382'],
  ['420:408', '420:409', 'existing-careers', 'Existing Obayashi careers page', '420:410'],
];

export default function ObayashiCaseStudyPage({ onOpenImage }) {
  const [active, setActive] = useState(sections[0][0]);
  useEffect(() => {
    document.title = 'Obayashi / Kiana George';
    let frame;
    const update = () => {
      const offset = document.querySelector('.site-header').getBoundingClientRect().height + 100;
      let current = sections[0][0];
      for (const [id] of sections) if (document.getElementById(id).getBoundingClientRect().top <= offset) current = id;
      setActive(current);
      frame = undefined;
    };
    const onScroll = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame !== undefined) cancelAnimationFrame(frame); };
  }, []);

  return <article className="obayashi-case" data-figma-node="420:76">
    <header className="obayashi-intro">
      <div><p className="obayashi-index">01 /</p><h1 data-figma-node="420:273">Obayashi</h1></div>
      <Copy id="420:272" className="obayashi-intro__summary" />
    </header>
    <div className="obayashi-project-details" data-figma-node="420:253">
      <Rule details />
      <dl className="obayashi-facts">{[
        ['Deliverable', '420:255'], ['Timeline', '420:258'], ['My contribution', '420:267'], ['Methods', '420:261'], ['Tools', '420:264'],
      ].map(([label, id]) => <div key={id}><dt>{label}</dt><Copy as="dd" id={id} /></div>)}</dl>
    </div>
    <div className="obayashi-showcase" aria-label="Obayashi Home and Our Markets designs" data-figma-node="420:240">
      <Exhibit name="home" alt="Redesigned Obayashi North America homepage" className="obayashi-showcase__home" onOpenImage={onOpenImage} eager />
      <Exhibit name="markets" cropName="hero-markets" alt="Redesigned Obayashi Our Markets page" className="obayashi-showcase__markets" onOpenImage={onOpenImage} eager />
    </div>
    <section className="obayashi-challenge" aria-labelledby="obayashi-challenge-title">
      <h2 id="obayashi-challenge-title">The <br />Challenge</h2>
      <div className="obayashi-challenge__copy">
        <Copy id="223:244" />
        {['223:240', '223:247', '223:248', '223:408'].map(id => {
          const [title, ...body] = text(id).split('\n');
          return <div key={id} data-figma-node={id}><h3>{title}</h3><p>{body.join(' ').trim()}</p></div>;
        })}
      </div>
    </section>
    <section className="obayashi-principles" aria-labelledby="obayashi-principles-title">
      <h2 id="obayashi-principles-title">Guiding <br />Principles</h2>
      <div>{[['420:348', '420:358'], ['420:349', '420:359'], ['420:350', '420:360'], ['420:351', '420:361']].map(([title, body]) => <div key={title}><Copy id={title} as="h3" /><Copy id={body} /></div>)}</div>
    </section>

    <div className="obayashi-method-layout">
      <nav className="obayashi-methodology" aria-label="Project sections">
        <p>Methodology</p>
        {sections.map(([id, title]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{title}</a>)}
      </nav>
      <div className="obayashi-content">
        <section id="competitive-analysis" className="obayashi-section obayashi-competitive" aria-labelledby="obayashi-competitive-title">
          <Rule /><h2 id="obayashi-competitive-title" data-figma-node="420:306">Benchmarking the<br />Competitive Landscape</h2>
          <Copy id="351:62" className="obayashi-section-intro" />
          <div className="obayashi-competitive__matrices">
            <Exhibit name="competitive-analysis-1" alt="Obayashi competitive analysis matrix covering project content and audience pathways" onOpenImage={onOpenImage} />
            <Exhibit name="competitive-analysis-2" alt="Obayashi competitive analysis matrix covering brand presentation and website features" onOpenImage={onOpenImage} />
          </div>
        </section>
        <section id="web-audit" className="obayashi-section obayashi-web-audit" aria-labelledby="obayashi-audit-title">
          <Rule /><h2 id="obayashi-audit-title" data-figma-node="420:336">Where the Existing Experience Fell Short</h2>
          <Copy id="420:337" className="obayashi-section-intro" />
          <ol className="obayashi-audit-list">{audit.map(([title, body, name, alt, icon], index) => <li key={name} className="obayashi-audit-row">
            <div><span className="obayashi-audit-icon" style={index === 3 ? { transform: 'scaleX(1.0575916)' } : undefined} aria-hidden="true"><img src={src('x-circle')} width="40" height="40" alt="" data-figma-node={icon} /></span><Copy id={title} as="h3" /><Copy id={body} /></div>
            <Exhibit name={name} alt={alt} onOpenImage={onOpenImage} />
          </li>)}</ol>
        </section>
        <section id="priorities" className="obayashi-section obayashi-priorities" aria-labelledby="obayashi-priorities-title">
          <Rule /><h2 id="obayashi-priorities-title" data-figma-node="429:75">Clarifying North American Site Priorities</h2>
          <Copy id="422:15" className="obayashi-section-intro" />
          <div className="obayashi-mind-map">
            <Exhibit name="mind-map" alt="Obayashi website strategy mind map" caption="Priorities for content, navigation, visual design, and measurement." onOpenImage={onOpenImage} />
            <span className="obayashi-mind-map__label" aria-hidden="true">MIND MAP</span><span className="obayashi-mind-map__center" aria-hidden="true"><strong>Obayashi</strong><br />Site Plan</span>
          </div>
          <div className="obayashi-decision" data-figma-node="474:23"><Copy id="474:24" as="h3" /><Copy id="474:26" /></div>
          <div className="obayashi-strategy"><Copy id="474:25" as="h3" /><ul data-figma-node="474:22">{text('474:22').split('\n').map(line => <li key={line}>{line}</li>)}</ul></div>
        </section>
        <section id="brand-narrative" className="obayashi-section obayashi-brand" aria-labelledby="obayashi-brand-title">
          <Rule /><h2 id="obayashi-brand-title" data-figma-node="424:17">The People Shaping the Brand</h2>
          <div className="obayashi-brand__intro">{['351:80', '474:35', '474:36'].map(id => <Copy key={id} id={id} />)}</div>
          <Exhibit name="interviews" alt="Montage of Obayashi stakeholder interview participants" onOpenImage={onOpenImage} />
          <figure className="obayashi-quote" data-figma-node="424:23"><span className="obayashi-quote__mark" aria-hidden="true">“</span><div><Copy id="424:25" as="blockquote" /><Copy id="424:28" as="figcaption" /></div></figure>
          <div className="obayashi-storyboard"><Copy id="424:31" as="h3" /><Copy id="424:30" /><Exhibit name="storyboard" alt="Obayashi company video storyboard connecting employee perspectives, projects and community" onOpenImage={onOpenImage} /></div>
          <div className="obayashi-brand-moments"><div>{[['family', 'Family'], ['trust', 'Built on Trust'], ['mentorship', 'Mentorship'], ['growth', 'Growth']].map(([name, label]) => <Exhibit key={name} name={name} alt={`Obayashi is ${label}: brand-story film still`} onOpenImage={onOpenImage} />)}</div><div><Copy id="429:79" as="h3" /><Copy id="429:80" /></div></div>
        </section>
        <section id="site-design" className="obayashi-section obayashi-design" aria-labelledby="obayashi-design-title">
          <Rule /><h2 id="obayashi-design-title" data-figma-node="429:97">Designing Around Projects,<br />People, and Expertise</h2>
          <Copy id="429:98" className="obayashi-section-intro" />
          <div className="obayashi-design-process"><Exhibit name="sketches" alt="Hand-drawn sketches for Obayashi Home, Who We Are, Leadership, Markets and Technology pages" onOpenImage={onOpenImage} /><div className="obayashi-wireframes">{[['home-wireframe', 'Home'], ['technology-wireframe', 'Technology'], ['markets-wireframe', 'Our Markets'], ['rail-wireframe', 'Rail & Transit']].map(([name, label]) => <Exhibit key={name} name={name} alt={`Obayashi ${label} wireframe`} onOpenImage={onOpenImage} />)}</div></div>
          <CareersLaptop assets={manifest.assets} caption={text('478:34')} onOpenImage={onOpenImage} />
          <div className="obayashi-final-designs">
            <div><Exhibit name="technology" alt="Redesigned Obayashi Technology page" captionId="478:33" onOpenImage={onOpenImage} /><Exhibit name="golden-gate" alt="Redesigned Golden Gate Bridge seismic retrofit project page" captionId="478:30" onOpenImage={onOpenImage} /><div className="obayashi-outcomes"><Copy id="474:28" as="h3" /><ul>{text('474:27').split('\n').slice(0, 4).map(line => <li key={line}>{line}</li>)}</ul><p>The redesign was presented to leadership and is currently in final implementation.</p></div></div>
            <div><Exhibit name="rail" alt="Redesigned Obayashi Rail and Transit page" captionId="478:31" onOpenImage={onOpenImage} /><Exhibit name="markets" slotId="474:32" alt="Redesigned Obayashi Our Markets page" captionId="478:32" onOpenImage={onOpenImage} /></div>
          </div>
        </section>
        <section id="retrospective" className="obayashi-section obayashi-retrospective" aria-labelledby="obayashi-retrospective-title">
          <Rule /><h2 id="obayashi-retrospective-title" data-figma-node="478:22">What I Learned</h2>
          <div className="obayashi-reflection" data-figma-node="478:23"><Copy id="478:24" as="h3" /><Copy id="478:26" className="obayashi-reflection__copy" /></div>
        </section>
      </div>
    </div>
    <div className="obayashi-end"><a href={`${siteUrl()}#work`}>Back to selected work <span aria-hidden="true">↗</span></a><a href={projectUrl('pointly')}>Next project: Point.ly <span aria-hidden="true">↗</span></a></div>
  </article>;
}
