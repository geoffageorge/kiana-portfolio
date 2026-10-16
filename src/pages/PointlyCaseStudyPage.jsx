import { useEffect, useState } from 'react';
import manifest from '../../public/assets/pointly-figma/manifest.json';
import mvpManifest from '../../public/assets/pointly-2/manifest.json';
import { assetUrl, siteUrl } from '../lib/urls.js';
import './PointlyCaseStudyPage.css';

const sections = [['interviews', 'Interviews'], ['research', 'Research'], ['design', 'Design'], ['retrospective', 'Retrospective']];
const imageSets = { 'pointly-figma': manifest, 'pointly-2': mvpManifest };
const mvpScreens = [
  { name: 'connected-wallet', title: 'Rewards Dashboard', description: 'View balances across rewards programs in one place.', alt: 'Point.ly connected rewards dashboard with balances across rewards programs' },
  { name: 'recommended-stays', title: 'Personalized Recommendations', description: 'Explore stays based on available points and preferences.', alt: 'Point.ly personalized hotel recommendations based on points and preferences' },
  { name: 'stay-details', title: 'Property Detail', description: 'Compare points, cash price, and redemption value before booking.', alt: 'Point.ly property detail comparing points, cash price, and redemption value' },
];
const interviewees = [
  ['node-66', 'Isa', 'Tech Worker, 30s', '“The bank portals feel like Expedia from 2010. It’s hard to know if I’m getting a good deal.”'],
  ['node-79', 'Jasmine', 'Professional, 30s', '“It’s hard to understand the real value of a points transfer — will I actually save money?”'],
  ['node-80', 'Afsaneh', 'Professional 50s', '“I want to plan trips with friends, but it’s so hard to coordinate and share options together.”'],
];
const personas = [
  ['node-83', 'The Strategic Optimizer', 'Knows the system and works to maximize value.'],
  ['node-81', 'The Aspirational Expert', 'Understands the basics and wants value, but needs guidance.'],
  ['node-82', 'The Casual Redeemer', 'Uses points sporadically and prioritizes ease.'],
];
const competitors = [
  ['seats-aero-2-87', 'Seats.aero', 'Guided award search with step-by-step booking support.'],
  ['roame-2-88', 'Roame', 'Broad multi-program search for quickly finding award availability.'],
  ['pointsyeah-2-86', 'PointsYeah', 'Flight and hotel award search with strong free tools.'],
  ['awardtool-2-91', 'AwardTool', 'Flexible award search with filters and trend data.'],
  ['maxmypoint-2-90', 'MaxMyPoint', 'Hotel-focused award availability and redemption alerts.'],
  ['node-89', 'AwardWallet', 'Centralized tracking for points balances and expirations.'],
  ['node-92', 'The Points Guy', 'Educational content, points valuations, and credit-card guidance.'],
  ['node-85', 'point.me', 'Powerful, fast award search designed for experienced users.'],
];
const insights = [
  ['node-128', <>Insight: Points mean nothing<br />without context</>, 'Knowing you have 80,000 points is meaningless unless you know what they can buy and whether transferring is worth it.'],
  ['node-127', <>Insight: Expertise created<br />an uneven playing field</>, 'Savvy travelers knew the transfer partners and redemption tricks. Everyone else had the same options but no easy way to find them.'],
  ['node-121', 'Opportunity: Suggest ways to pool rewards for group travel', 'For people planning together, looking at combined resources rather than individual balances could open travel options'],
  ['node-120', <>Opportunity: Provide ideas to<br />close points gaps fast</>, 'Instead of a flat “not enough points,” provide a list of creative ways to close the gap, such as current promos and affiliated points programs.'],
];

function Picture({ name, alt = '', className = '', eager = false, assetGroup = 'pointly-figma' }) {
  const image = imageSets[assetGroup].assets[name];
  return <img className={className} src={assetUrl(`${assetGroup}/${image.file}`)} width={image.width} height={image.height} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" data-figma-node={image.figmaNodeId} data-figma-asset={assetGroup === 'pointly-figma' ? name : undefined} />;
}

function Exhibit({ name, alt, className = '', onOpenImage, eager = false, assetGroup = 'pointly-figma', children }) {
  const image = imageSets[assetGroup].assets[name];
  return <figure className={`pointly-exhibit ${className}`}><button type="button" aria-label={`Enlarge ${alt}`} onClick={() => onOpenImage({ ...image, src: assetUrl(`${assetGroup}/${image.file}`), alt })}><Picture name={name} alt={alt} eager={eager} assetGroup={assetGroup} /></button>{children && <figcaption>{children}</figcaption>}</figure>;
}

function Rule({ name }) {
  return <div className="pointly-rule" aria-hidden="true"><Picture name={name} /></div>;
}

function VisualIdentity() {
  return <div className="pointly-visual-system" aria-label="Point.ly color palette and typography" data-figma-node="314:30">
    <div className="pointly-palettes">
      <h4>Primary palette</h4>
      <div className="pointly-primary-palette">{['FCFCF8', 'DE8E5C', '23395A'].map(color => <div key={color} style={{ backgroundColor: `#${color}` }}><span>{color}</span></div>)}</div>
      <h4>Secondary Palette</h4>
      <div className="pointly-secondary-palette">{[['rectangle-5-142', 'BECDD6'], ['rectangle-4-141', 'D9564D'], ['rectangle-3-140', '4E76B6'], ['rectangle-19-143', '40B3FC']].map(([name, color]) => <div key={name}><Picture name={name} /><span>{color}</span></div>)}</div>
    </div>
    <div className="pointly-type-specimen">
      <h4>Typography</h4>
      <div className="pointly-type-heads"><p className="pointly-specimen-label">HEADS</p><p className="pointly-poppins-bold">Poppins Bold</p></div>
      <div className="pointly-type-buttons"><p className="pointly-specimen-label">BUTTONS</p><p className="pointly-poppins-medium">Poppins Medium</p></div>
      <div className="pointly-type-body"><p className="pointly-specimen-label">BODY</p><div><p>Inter Regular</p><p><em>Inter Regular Italic</em></p><p className="pointly-medium">Inter Medium</p><p className="pointly-medium"><em>Inter Medium Italic</em></p><p><strong>Inter Bold</strong></p><p><strong>Inter Bold Italic</strong></p></div></div>
      <Picture className="pointly-brand-traveler" name="node-154" alt="Point.ly traveler walking beside a globe" />
    </div>
  </div>;
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

  return <article className="pointly-case" data-figma-node="90:18">
    <header className="pointly-intro">
      <div><p className="pointly-index">01 /</p><h1 data-figma-node="123:3">Point.ly</h1></div>
      <div className="pointly-intro__summary"><p data-figma-node="123:5">Turning fragmented loyalty points into new travel possibilities</p><p className="pointly-intro__team">UX@Berkeley project team</p></div>
    </header>
    <dl className="pointly-facts">{[
      ['Deliverable', ['Working MVP']], ['Timeline', ['8 months +', 'one day hackathon']],
      ['My contribution', ['UX research', 'Prototyping', 'Visual Identity']],
      ['Methods', ['10 User Interviews', 'Competitive Analysis', 'Product Strategy', 'PRD Development', 'Prototyping', 'Usability Testing']],
      ['Tools', ['Figma', 'Cursor', 'Claude', 'Gemini']],
    ].map(([label, lines]) => <div key={label}><dt>{label}</dt><dd>{lines.map(line => <span key={line}>{line}</span>)}</dd></div>)}</dl>
    <div className="pointly-showcase" aria-label="Point.ly homepage design" data-figma-node="274:4">
      <Exhibit name="frame-3-2-159" alt="Point.ly homepage destinations and three steps from points to takeoff" className="pointly-showcase__destinations" onOpenImage={onOpenImage} eager />
      <Exhibit name="frame-3-2-1-186" alt="Point.ly homepage final design and destination discovery" className="pointly-showcase__home" onOpenImage={onOpenImage} eager />
    </div>
    <div className="pointly-rewards-flow" aria-label="Point.ly personalized travel recommendations" data-figma-node="320:57">
      <Exhibit name="05-featured-stay-2-178" alt="Point.ly featured stay recommendation" className="pointly-flow__stay" onOpenImage={onOpenImage} eager />
      <Exhibit name="04-points-options-1-177" alt="Point.ly points and transfer options" className="pointly-flow__options" onOpenImage={onOpenImage} eager />
      <Exhibit name="08-pro-tips-2-179" alt="Point.ly tips for getting more from travel rewards" className="pointly-flow__tips" onOpenImage={onOpenImage} eager />
    </div>
    <section className="pointly-challenge" aria-labelledby="pointly-challenge-title">
      <h2 id="pointly-challenge-title">The <br />Challenge</h2>
      <div className="pointly-challenge__copy">
        <p>Point.ly began as a startup concept from a United Airlines manager who wanted to give travelers one view of their rewards. Travelers face three problems:</p>
        <div><h3>Scattered rewards</h3><p>Travelers accumulate points across credit cards, airlines, and hotels without a clear view of what they can unlock together.</p></div>
        <div><h3>Finding the best redemption requires expertise</h3><p>Comparing cash, points, transfer partners, and booking portals means navigating different values, rules, and systems.</p></div>
        <div><h3>Groups can’t pool rewards</h3><p>Friends may have significant rewards collectively, but few tools show what becomes possible when their points are considered together.</p></div>
      </div>
    </section>
    <section className="pointly-goals" aria-labelledby="pointly-goals-title">
      <h2 id="pointly-goals-title">Goals</h2>
      <div className="pointly-goals__diagram"><ol className="pointly-goals__steps">{[
        ['ellipse-12-52', 'SIMPLIFY', <>One view of<br />all rewards</>],
        ['ellipse-13-53', 'CLARIFY', <>Easy booking<br />comparisons</>],
        ['ellipse-14-54', <>BUILD<br />CONFIDENCE</>, <>Certainty of<br />best value</>],
      ].map(([name, label, text]) => <li key={name}><Picture name={name} /><strong>{label}</strong><span>{text}</span></li>)}</ol><Picture name="line-65-62" className="pointly-goal-connector pointly-goal-connector--first" /><Picture name="line-66-63" className="pointly-goal-connector pointly-goal-connector--second" /></div>
    </section>
    <div className="pointly-method-layout">
      <nav className="pointly-methodology" aria-label="Project sections"><p>Methodology</p>{sections.map(([id, title]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setActive(id)}>{title}</a>)}</nav>
      <div className="pointly-content">
        <section id="interviews" className="pointly-section pointly-interviews" aria-labelledby="pointly-interviews-title">
          <Rule name="line-69-49" /><h2 id="pointly-interviews-title">Different travelers.<br />A shared need for clarity</h2>
          <p className="pointly-section__intro">I interviewed 10 travelers to understand how they managed rewards, evaluated redemption value, and navigated decisions around transfers and group travel.</p>
          <div className="pointly-interview-grid">{interviewees.map(([name, person, detail, quote]) => <figure className="pointly-interview-card" key={person}><blockquote>{quote}</blockquote><Picture name={name} alt={`Illustration of ${person}, a Point.ly interview participant`} /><figcaption><h3>{person}</h3><p>{detail}</p></figcaption></figure>)}</div>
          <figure className="pointly-interview-wide" data-figma-node="136:70"><Picture name="node-74" alt="Illustration of Daniel considering his rewards across travel programs" /><figcaption><h3>Daniel</h3><p>Student, 20s</p></figcaption><blockquote>“I want a single view of all my points so I don’t have to log into multiple accounts.”</blockquote></figure>
          <aside className="pointly-feature-callout" data-figma-node="138:92"><h3>Insight</h3><p>Users did not necessarily need more ways to earn points. They needed help understanding the value already sitting in their wallets.</p></aside>
          <div className="pointly-personas"><h3>Three personas emerged</h3><div>{personas.map(([name, title, text]) => <section key={name}><div className="pointly-persona-portrait"><Picture name={name} /></div><h4>{title}</h4><p>{text}</p></section>)}</div></div>
        </section>
        <section id="research" className="pointly-section pointly-research" aria-labelledby="pointly-research-title">
          <Rule name="line-70-50" /><h2 id="pointly-research-title">Research Revealed Insights</h2>
          <div className="pointly-subsection pointly-competitors"><h3>Exploring the Solution Space</h3><p>We analyzed existing rewards platforms to understand competitors’ unique differentiating features</p><ul>{competitors.map(([name, title, text]) => <li key={name}><div className="pointly-competitor-logo"><Picture name={name} alt={title} /></div><p>{text}</p></li>)}</ul></div>
          <div className="pointly-subsection pointly-opportunity-map"><h3>Opportunity Maps</h3><p>We mapped each competitors’ features and user flows to identify strengths, friction points, and opportunities</p><Exhibit name="node-124" alt="Opportunity map comparing rewards platform features, user flows, and research findings" onOpenImage={onOpenImage} /></div>
          <div className="pointly-subsection pointly-insights"><h3>Key Insights and Opportunities</h3><div>{insights.map(([name, title, text]) => <aside className="pointly-insight" key={name}><Picture name={name} /><div><h4>{title}</h4><p>{text}</p></div></aside>)}</div></div>
        </section>
        <section id="design" className="pointly-section pointly-design" aria-labelledby="pointly-design-title">
          <Rule name="line-71-51" /><h2 id="pointly-design-title">Designing the User Experience</h2>
          <div className="pointly-subsection pointly-low-fi"><h3>Low-Fi: Testing Different Directions</h3><p>Guided by our research, we quickly explored multiple concepts, including a Chrome extension, centralized rewards wallet, AI trip planning, itinerary comparison, and personalized points recommendations.</p><div className="pointly-low-fi__images"><Exhibit name="node-125" alt="Annotated low-fidelity sketches for a centralized rewards wallet" onOpenImage={onOpenImage} /><Exhibit name="node-126" alt="Annotated low-fidelity explorations of trip planning and points recommendations" onOpenImage={onOpenImage} /></div></div>
          <div className="pointly-subsection pointly-mid-fi"><h3>Mid-Fi: Narrowing the Experience</h3><p>We prioritized the concepts that most directly addressed our research findings: consolidating rewards, simplifying comparisons, and making redemption opportunities actionable. Broader ideas that moved beyond these core needs were deprioritized.</p><div className="pointly-mid-fi__images"><Exhibit name="node-160" alt="Mid-fidelity Point.ly dashboard wireframe" onOpenImage={onOpenImage} /><div className="pointly-mid-fi__comparison"><Exhibit name="node-161" alt="Mid-fidelity flight comparison wireframe" onOpenImage={onOpenImage} /><Exhibit name="node-162" alt="Mid-fidelity booking details wireframe" onOpenImage={onOpenImage} /></div></div></div>
          <div className="pointly-subsection pointly-identity"><h3>Establishing an Approachable Visual Identity</h3><p>I developed Point.ly’s visual identity to make the complexity of credit card points feel clear and approachable, balancing a friendly personality with the credibility of a financial tool.</p><VisualIdentity /></div>
          <div id="mvp-prototype" className="pointly-subsection pointly-mvp">
            <h3>From Research to MVP Prototype</h3>
            <p>We translated our research into a high-fidelity MVP prototype focused on consolidating rewards, comparing redemption options, and guiding travelers toward booking. The project remained at the prototype stage.</p>
            <div className="pointly-mvp-gallery">
              {mvpScreens.map(({ name, title, description, alt }) => <Exhibit key={name} name={name} alt={alt} assetGroup="pointly-2" className="pointly-mvp-feature" onOpenImage={onOpenImage}><h4>{title}</h4><p>{description}</p></Exhibit>)}
            </div>
          </div>
        </section>
        <section id="retrospective" className="pointly-section pointly-retrospective" aria-labelledby="pointly-retrospective-title">
          <Rule name="line-72-183" /><h2 id="pointly-retrospective-title">What I Learned</h2>
          <aside className="pointly-feature-callout pointly-reflection" data-figma-node="314:34"><h3>Reflection</h3><div><p>Interviewing travelers with different habits and levels of points experience taught me that people can approach the same problem differently but still need similar things from a product.</p><p>At the hackathon, I turned our findings into a PRD, used AI coding tools to build a working prototype, and tested it with users. This helped me connect what I heard in interviews to specific choices about how the product should work.</p><p>The biggest lesson came from working through the full process: listening to a full spectrum of user experiences, making sense of what I heard, building, testing, and improving the design based on feedback.</p></div></aside>
        </section>
      </div>
    </div>
    <a className="pointly-back" href={`${siteUrl()}#work`}>Back to selected work <span aria-hidden="true">↗</span></a>
  </article>;
}
