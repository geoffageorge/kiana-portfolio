import { useEffect, useState } from 'react';
import manifest from '../../public/assets/pointly-2/manifest.json';
import { assetUrl, siteUrl } from '../lib/urls.js';
import './PointlyCaseStudyPage.css';

const sections = [['interviews', 'Interviews'], ['research', 'Research'], ['design', 'Design'], ['retrospective', 'Retrospective']];
const interviewees = [
  { asset: 'isa', name: 'Isa', detail: 'Tech Worker, 30s', quote: '“The bank portals feel like Expedia from 2010. It’s hard to know if I’m getting a good deal.”' },
  { asset: 'jasmine', name: 'Jasmine', detail: 'Professional, 30s', quote: '“It’s hard to understand the real value of a points transfer — will I actually save money?”' },
  { asset: 'afsaneh', name: 'Afsaneh', detail: 'Professional 50s', quote: '“I want to plan trips with friends, but it’s so hard to coordinate and share options together.”' },
];
const personas = [
  ['strategic-optimizer', 'The Strategic Optimizer', 'Knows the system and works to maximize value.'],
  ['aspirational-expert', 'The Aspirational Expert', 'Understands the basics and wants value, but needs guidance.'],
  ['casual-redeemer', 'The Casual Redeemer', 'Uses points sporadically and prioritizes ease.'],
];
const competitors = [
  ['seats-aero', 'Seats.aero', 'Guided award search with step-by-step booking support.'],
  ['roame', 'Roame', 'Broad multi-program search for quickly finding award availability.'],
  ['pointsyeah', 'PointsYeah', 'Flight and hotel award search with strong free tools.'],
  ['awardtool', 'AwardTool', 'Flexible award search with filters and trend data.'],
  ['maxmypoint', 'MaxMyPoint', 'Hotel-focused award availability and redemption alerts.'],
  ['awardwallet', 'AwardWallet', 'Centralized tracking for points balances and expirations.'],
  ['the-points-guy', 'The Points Guy', 'Educational content, points valuations, and credit-card guidance.'],
  ['point-me', 'point.me', 'Powerful, fast award search designed for experienced users.'],
];
const insights = [
  ['insight', 'Insight: Points mean nothing without context', 'Knowing you have 80,000 points is meaningless unless you know what they can buy and whether transferring is worth it.'],
  ['insight', 'Insight: Expertise created an uneven playing field', 'Savvy travelers knew the transfer partners and redemption tricks. Everyone else had the same options but no easy way to find them.'],
  ['opportunity', 'Opportunity: Provide ideas to close points gaps fast', 'Instead of a flat “not enough points,” provide a list of creative ways to close the gap, such as current promos and affiliated points programs.'],
  ['opportunity', 'Opportunity: Suggest ways to pool rewards for group travel', 'For people planning together, looking at combined resources rather than individual balances could open travel options'],
];
const mvpScreens = [
  {
    name: 'connected-wallet',
    alt: 'Point.ly connected rewards dashboard with balances across rewards programs',
    title: 'Rewards Dashboard',
    description: 'View balances across rewards programs in one place.',
  },
  {
    name: 'recommended-stays',
    alt: 'Point.ly personalized hotel recommendations based on points and preferences',
    title: 'Personalized Recommendations',
    description: 'Explore stays based on available points and preferences.',
  },
  {
    name: 'stay-details',
    alt: 'Point.ly property detail comparing points, cash price, and redemption value',
    title: 'Property Detail',
    description: 'Compare points, cash price, and redemption value before booking.',
  },
];

function imageData(name, alt) {
  const asset = manifest.assets[name];
  return { src: assetUrl(`pointly-2/${asset.file}`), width: asset.width, height: asset.height, alt };
}

function Picture({ name, alt, className = '', eager = false }) {
  return <img {...imageData(name, alt)} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

function Exhibit({ name, alt, onOpenImage, className = '', eager = false, children }) {
  const image = imageData(name, alt);
  return <figure className={`pointly-exhibit ${className}`}>
    <button type="button" onClick={() => onOpenImage(image)} aria-label={`Enlarge ${image.alt}`}>
      <img {...image} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : undefined} />
    </button>
    {children && <figcaption>{children}</figcaption>}
  </figure>;
}

function InsightIcon({ type }) {
  return <span className="pointly-insight-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {type === 'insight' ? <>
      <path d="M17 31c0-5-5-7-5-14a12 12 0 0 1 24 0c0 7-5 9-5 14M17 31h14M18 35h12M19 39h10M21 43h6M24 1v-4M9 6 6 3M39 6l3-3M6 17H2M42 17h4" />
    </> : <path d="M24 3c1.5 12 7.5 18 20 21-12.5 3-18.5 9-20 21C22.5 33 16.5 27 4 24 16.5 21 22.5 15 24 3Z" />}
  </svg></span>;
}

export default function PointlyCaseStudyPage({ onOpenImage }) {
  const [active, setActive] = useState('interviews');
  useEffect(() => {
    document.title = 'Point.ly / Kiana George';
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -60% 0px' });
    for (const [id] of sections) observer.observe(document.getElementById(id));
    return () => observer.disconnect();
  }, []);

  return <article className="pointly-case">
    <header className="pointly-intro">
      <div><p className="pointly-index">02 /</p><h1>Point.ly</h1></div>
      <div className="pointly-intro__summary"><p>Turning fragmented loyalty points into new<br className="pointly-desktop-break" /> travel possibilities</p><p className="pointly-intro__team">UX@Berkeley project team</p></div>
    </header>
    <dl className="pointly-facts">
      {[
        ['Deliverable', ['Working MVP']],
        ['Timeline', ['8 months +', 'one day hackathon']],
        ['My contribution', ['UX research', 'Prototyping', 'Visual Identity']],
        ['Research', ['10 Interviews', 'Usability Testing']],
        ['Methods', ['User Interviews', 'Competitive Analysis', 'Product Strategy', 'PRD Development', 'Prototyping', 'Usability Testing']],
        ['Tools', ['Figma', 'Cursor', 'Claude', 'Gemini']],
      ].map(([label, lines]) => <div key={label}><dt>{label}</dt><dd>{lines.map(line => <span key={line}>{line}</span>)}</dd></div>)}
    </dl>
    <Exhibit name="hero-showcase" alt="Point.ly homepage final design and destination discovery" onOpenImage={onOpenImage} eager className="pointly-showcase" />
    <Exhibit name="rewards-flow" alt="Point.ly rewards recommendations, transfer options, and ways to make points go further" onOpenImage={onOpenImage} className="pointly-rewards-flow" />

    <section className="pointly-challenge" aria-labelledby="pointly-challenge-title">
      <h2 id="pointly-challenge-title">The<br /> Challenge</h2>
      <div>
        <p>Point.ly began as a startup concept from a United Airlines manager who wanted to give travelers one view of their rewards. Travelers face three problems:</p>
        <div><h3>Scattered rewards</h3><p>Travelers accumulate points across credit cards, airlines, and hotels without a clear view of what they can unlock together.</p></div>
        <div><h3>Finding the best redemption requires expertise</h3><p>Comparing cash, points, transfer partners, and booking portals means navigating different values, rules, and systems.</p></div>
        <div><h3>Groups can’t pool rewards</h3><p>Friends may have significant rewards collectively, but few tools show what becomes possible when their points are considered together.</p></div>
      </div>
    </section>

    <section className="pointly-goals" aria-labelledby="pointly-goals-title">
      <h2 id="pointly-goals-title">Goals</h2>
      <ol className="pointly-goals__steps">
        {[
          ['Simplify', <>One view of<br />all rewards</>],
          ['Clarify', <>Easy booking<br />comparisons</>],
          ['Build confidence', <>Certainty of<br />best value</>],
        ].map(([label, text]) => <li key={label}><strong>{label}</strong><span>{text}</span></li>)}
      </ol>
    </section>

    <div className="pointly-method-layout">
      <nav className="case-navigation pointly-methodology" aria-label="Project sections">
        <p>Methodology</p>
        {sections.map(([id, title]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setActive(id)}>{title}</a>)}
      </nav>
      <div className="pointly-content">
        <section id="interviews" className="pointly-section pointly-interviews" aria-labelledby="pointly-interviews-title">
          <h2 id="pointly-interviews-title">Different travelers.<br />A shared need for clarity</h2>
          <p className="pointly-section__intro">I interviewed 10 travelers to understand how they managed rewards, evaluated redemption value, and navigated decisions around transfers and group travel.</p>
          <div className="pointly-interview-grid">
            {interviewees.map(person => <figure className="pointly-interview-card" key={person.name}>
              <blockquote>{person.quote}</blockquote>
              <Picture name={person.asset} alt={`Illustration of ${person.name}, a Point.ly interview participant`} />
              <figcaption><h3>{person.name}</h3><p>{person.detail}</p></figcaption>
            </figure>)}
          </div>
          <figure className="pointly-interview-wide">
            <div><Picture name="daniel" alt="Illustration of Daniel considering his rewards across travel programs" /><figcaption><h3>Daniel</h3><p>Student, 20s</p></figcaption></div>
            <blockquote>“I want a single view of all my points so I don’t have to log into multiple accounts.”</blockquote>
          </figure>
          <aside className="pointly-feature-callout"><h3>Insight</h3><p>Users did not necessarily need more ways to earn points. They needed help understanding the value already sitting in their wallets.</p></aside>
          <div className="pointly-personas"><h3>Three personas emerged</h3><div>
            {personas.map(([asset, title, text]) => <section key={asset}><Picture name={asset} alt="" /><h4>{title}</h4><p>{text}</p></section>)}
          </div></div>
        </section>

        <section id="research" className="pointly-section pointly-research" aria-labelledby="pointly-research-title">
          <h2 id="pointly-research-title">Research Revealed Insights</h2>
          <div className="pointly-subsection pointly-competitors">
            <h3>Exploring the Solution Space</h3>
            <p>We analyzed existing rewards platforms to understand competitors’ unique differentiating features</p>
            <ul>{competitors.map(([asset, title, text]) => <li key={asset}><Picture name={asset} alt={title} /><p>{text}</p></li>)}</ul>
          </div>
          <div className="pointly-subsection pointly-opportunity-map">
            <h3>Opportunity Maps</h3>
            <p>We mapped each competitors’ features and user flows to identify strengths, friction points, and opportunities</p>
            <Exhibit name="opportunity-map" alt="Seats.aero opportunity map comparing features, user flows, and research findings" onOpenImage={onOpenImage} />
          </div>
          <div className="pointly-subsection pointly-insights">
            <h3>Key Insights and Opportunities</h3>
            <div>{insights.map(([type, title, text]) => <aside className="pointly-insight" key={title}><InsightIcon type={type} /><div><h4>{title}</h4><p>{text}</p></div></aside>)}</div>
          </div>
        </section>

        <section id="design" className="pointly-section pointly-design" aria-labelledby="pointly-design-title">
          <h2 id="pointly-design-title">Designing the User Experience</h2>
          <div className="pointly-subsection pointly-low-fi">
            <h3>Low-Fi: Testing Different Directions</h3>
            <p>Guided by our research, we quickly explored multiple concepts, including a Chrome extension, centralized rewards wallet, AI trip planning, itinerary comparison, and personalized points recommendations.</p>
            <div className="pointly-low-fi__images">
              <Exhibit name="low-fi-wallet" alt="Annotated low-fidelity sketches for a centralized rewards wallet" onOpenImage={onOpenImage} />
              <Exhibit name="low-fi-exploration" alt="Annotated low-fidelity explorations of trip planning and points recommendations" onOpenImage={onOpenImage} />
            </div>
          </div>
          <div className="pointly-subsection pointly-mid-fi">
            <h3>Mid-Fi: Narrowing the Experience</h3>
            <p>We prioritized the concepts that most directly addressed our research findings: consolidating rewards, simplifying comparisons, and making redemption opportunities actionable. Broader ideas that moved beyond these core needs were deprioritized.</p>
            <div className="pointly-mid-fi__images">
              <Exhibit name="mid-fi-dashboard" alt="Mid-fidelity Point.ly dashboard wireframe" onOpenImage={onOpenImage} />
              <Exhibit name="mid-fi-comparison" alt="Mid-fidelity flight comparison and booking details wireframes" onOpenImage={onOpenImage} />
            </div>
          </div>
          <div className="pointly-subsection pointly-identity">
            <h3>Establishing an Approachable Visual Identity</h3>
            <p>I developed Point.ly’s visual identity to make the complexity of credit card points feel clear and approachable, balancing a friendly personality with the credibility of a financial tool.</p>
            <Exhibit name="visual-system" alt="Point.ly visual identity: cream, orange, navy and blue palette with Poppins headings and Inter body typography" onOpenImage={onOpenImage} />
          </div>
          <div id="mvp-prototype" className="pointly-subsection pointly-mvp">
            <h3>From Research to MVP Prototype</h3>
            <p>We translated our research into a high-fidelity MVP prototype focused on consolidating rewards, comparing redemption options, and guiding travelers toward booking. The project remained at the prototype stage.</p>
            <div className="pointly-mvp-gallery">
              {mvpScreens.map(({ name, alt, title, description }) => <Exhibit key={name} name={name} alt={alt} className="pointly-mvp-feature" onOpenImage={onOpenImage}>
                <h4>{title}</h4><p>{description}</p>
              </Exhibit>)}
            </div>
          </div>
        </section>

        <section id="retrospective" className="pointly-section pointly-retrospective" aria-labelledby="pointly-retrospective-title">
          <h2 id="pointly-retrospective-title">What I Learned</h2>
          <aside className="pointly-feature-callout pointly-reflection"><h3>Reflection</h3><div>
            <p>Interviewing travelers with different habits and levels of points experience taught me that people can approach the same problem differently but still need similar things from a product.</p>
            <p>At the hackathon, I turned our findings into a PRD, used AI coding tools to build a working prototype, and tested it with users. This helped me connect what I heard in interviews to specific choices about how the product should work.</p>
            <p>The biggest lesson came from working through the full process: listening to a full spectrum of user experiences, making sense of what I heard, building, testing, and improving the design based on feedback.</p>
          </div></aside>
        </section>
      </div>
    </div>
    <a className="pointly-back" href={`${siteUrl()}#work`}>Back to selected work <span aria-hidden="true">↗</span></a>
  </article>;
}
