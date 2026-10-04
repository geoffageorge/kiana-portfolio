import sourceImages from '../../../pointly project/asset-manifest.json';
import { assetUrl } from '../../lib/urls.js';

// Content comes from the archived Point.ly case study. Keep claims tied to that
// source: this was a working MVP, not a documented commercial product launch.
const image = (index, caption, stage) => {
  const original = sourceImages.find(item => item.index === index);
  return { src: assetUrl(`pointly/${original.file}`), alt: original.alt, width: original.width, height: original.height, caption, stage };
};

export const pointly = {
  slug: 'pointly',
  title: 'Point.ly',
  number: '02',
  eyebrow: 'Research / Product design / AI prototyping',
  subtitle: 'Turning fragmented loyalty points into travel possibilities.',
  summary: 'A more connected way to understand rewards, compare booking options, and decide where your points can take you.',
  heroImage: image(23, 'Explore — redemption options, transfer paths, and points required in one place.'),
  metadata: [
    { label: 'Deliverable', value: 'Working MVP' },
    { label: 'Team', value: 'UX@Berkeley product team' },
    { label: 'Timeline', value: '8 months + one-day AI hackathon' },
    { label: 'My role', value: 'UX research, product design & visual direction' },
  ],
  sections: [
    {
      id: 'about', type: 'about', title: 'About', headline: 'A new possibility for points-based travel.',
      intro: 'Point.ly began as a startup concept independently developed by a United Airlines manager.',
      blocks: [{ type: 'text', paragraphs: ['Over two semesters, our UX@Berkeley team developed the idea into a product concept that helps travelers consolidate rewards across credit cards, airlines, and hotels, compare booking options, and make more informed redemption decisions.'] }],
    },
    {
      id: 'deliverable', type: 'deliverable', title: 'Deliverable', headline: 'From research to a working MVP.',
      intro: 'I contributed across user research and prototyping while leading the product’s visual direction and designing key experiences.',
      blocks: [
        { type: 'text', heading: 'The brief', paragraphs: ['Develop a working MVP that connects travelers’ rewards, preferences, and booking options. The work spanned eight months and culminated in a one-day AI prototyping hackathon.'] },
        { type: 'list', heading: 'My contribution', columns: 2, items: [
          '10 user interviews', 'Competitive analysis and research synthesis', 'Usability testing', 'Product and feature ideation', 'Low-fidelity prototyping', 'Homepage and Explore UX/UI', 'Visual identity and creative direction', 'Typography, color, illustration, and layout system', 'Cross-team design consistency', 'PRD-to-prototype workflow', 'AI-assisted prototyping with Cursor, Claude, and Gemini',
        ] },
        { type: 'list', heading: 'Methods', columns: 2, items: ['Competitive analysis', 'User interviews', 'Product strategy', 'PRD development', 'Prototyping', 'Usability testing'] },
      ],
    },
    {
      id: 'completed', type: 'completed', title: 'Completed', headline: 'One connected travel experience.',
      intro: 'The final experience brought the core journey together—from onboarding and rewards setup to searching and comparing redemption options.',
      blocks: [
        { type: 'gallery', columns: 2, images: [
          image(19, 'Homepage — a clear entry point for searching and comparing travel with points.', 'Final MVP'),
          image(23, 'Explore — redemption options are compared in one place, including transfer paths and points required.', 'Final MVP'),
        ] },
        { type: 'gallery', columns: 2, images: [
          image(20, 'Onboarding begins by explaining how personalization improves results.', 'Welcome'),
          image(21, 'Home airport selection grounds recommendations in the traveler’s actual context.', 'Home airport'),
          image(22, 'Users add the credit card and airline programs they already have.', 'Rewards setup'),
        ] },
      ],
    },
    {
      id: 'user-persona', type: 'persona', title: 'User Persona', headline: 'Different travelers. A shared need for clarity.',
      intro: 'Across 10 interviews, three traveler profiles emerged, each with a different relationship to their points.',
      blocks: [
        { type: 'cards', variant: 'personas', items: [
          { title: 'The Strategic Optimizer', body: 'Deeply knowledgeable about redemption values and transfer bonuses, but drowning in fragmented tools and decision fatigue.', quote: 'It’s like a restaurant with a 10-page menu — overwhelming.', attribution: 'Shazzy, user interview' },
          { title: 'The Aspirational Hacker', body: 'Knows basic point mechanics but lacks the trust or patience to optimize fully — no centralized view of balances or transfer value.', quote: 'I don’t know how to transfer points… I just pick whichever looks cheaper.', attribution: 'Isa, user interview' },
          { title: 'The Casual Spender', body: 'Uses points occasionally through the bank app, prefers simplicity, and isn’t sure if they’re getting good value.', quote: 'I didn’t even know you could transfer points — it’s not publicized.', attribution: 'Afsaneh, user interview' },
        ] },
        { type: 'cards', heading: 'The problem behind those profiles', items: [
          { title: 'Rewards were scattered across platforms.', body: 'Travelers accumulated points across credit cards, airlines, and hotels without a clear view of what they could unlock together.' },
          { title: 'Finding the best redemption required expertise.', body: 'Comparing cash, points, transfer partners, and booking portals meant navigating different values, rules, and systems.' },
          { title: 'Groups lacked a way to combine their rewards.', body: 'Friends often had significant rewards collectively, but few tools showed what became possible when their points were considered together.' },
        ] },
      ],
    },
    {
      id: 'research', type: 'research', title: 'Research', headline: 'Understanding how travelers use their points.',
      intro: 'We analyzed travel portals, loyalty programs, and rewards tools, then interviewed 10 travelers to understand how they tracked, evaluated, and redeemed points.',
      links: [{ id: 'product-strategy', title: 'Product strategy' }],
      blocks: [
        { type: 'list', heading: 'Questions we explored', items: [
          'How users tracked rewards across programs', 'How they determined what their points were worth', 'How they compared points and cash', 'Where transfer decisions became difficult', 'How people approached rewards when traveling together', 'Which decisions required the most points expertise',
        ] },
        { type: 'quote', text: 'The research reframed the opportunity. Users did not necessarily need more ways to earn points. They needed help understanding the value already sitting in their wallets.' },
        { type: 'cards', heading: 'What the research revealed', columns: 2, items: [
          { title: 'A points balance means little without context.', body: 'A balance alone did not tell travelers what their points could unlock. Users still had to determine transfer value and compare it with paying cash.' },
          { title: 'Rewards expertise created an uneven playing field.', body: 'Experienced travelers had an advantage because they understood the system. Less experienced users often had access to the same opportunities without knowing how to identify them.' },
          { title: 'Combined rewards could change what was possible.', body: 'Pooling the picture changed what felt possible. For people traveling together, evaluating shared resources surfaced options that neither individual balance could unlock alone.' },
          { title: '“Not enough points” did not have to be a dead end.', body: 'A points shortfall did not have to end the search. It could become another decision point: find an alternative, transfer rewards, or identify a realistic path to closing the gap.' },
        ] },
        { type: 'text', id: 'product-strategy', heading: 'Turning insights into product strategy', paragraphs: ['Our research led to a clear product goal: turn scattered loyalty balances into actionable travel possibilities.'] },
        { type: 'list', items: [
          'Start with what the traveler actually has. Bring rewards across programs into one view so recommendations reflect users’ real resources.',
          'Make value easier to compare. Show points, cash, and card-portal options together rather than forcing users to calculate the tradeoffs themselves.',
          'Make points expertise more accessible. Use the product to surface transfer opportunities and redemption guidance that typically require deeper rewards knowledge.',
          'Design for shared travel. Allow travel partners to understand what becomes possible when their rewards are considered together.',
          'Turn constraints into next steps. When a preferred option is out of reach, surface nearby alternatives or ways to close the points gap.',
        ] },
        { type: 'gallery', images: [image(2, 'The Travel Profile Report — turning a user’s points into a concrete transfer plan.', 'Product strategy')] },
      ],
    },
    {
      id: 'design-evolution', type: 'evolution', title: 'Design Evolution', headline: 'What we explored. What we shipped.',
      intro: 'Early brainstorming pulled together every idea on the table — a unified points hub, an AI layer that does the work for you, itinerary comparison, a planning chatbot — before narrowing into a single direction. Turning that into a real product meant testing several ways to deliver on the strategy, and cutting the ones that didn’t hold up.',
      blocks: [
        { type: 'gallery', images: [image(3, 'Early brainstorming — consolidating points, an AI “do it for you” layer, itinerary comparison, and a planning chatbot were all on the table.', 'Early exploration')] },
        { type: 'text', heading: '01 / A companion Chrome extension → a single web app' },
        { type: 'gallery', columns: 2, images: [image(4, 'An in-browser pop-up surfacing price comparisons and recommended add-ons.', 'Explored'), image(5, 'A sitemap that still included the extension as an entry point.', 'Explored')] },
        { type: 'text', paragraphs: ['Scoped out in favor of one focused web experience, once it was clear the core value (comparing points across programs) didn’t need a separate browser layer.'] },
        { type: 'text', heading: '02 / A map-and-chat AI concierge → a guided flow', paragraphs: ['Two early sketches — an interactive map for browsing destinations, and a chat-based points report — converged into one richer concept: an AI concierge with an award map, a “Sweet Spots” deals guide, and a booking chat.'] },
        { type: 'gallery', columns: 2, images: [
          image(6, 'Map concept, sketched.', 'Sketch'), image(7, 'Chat report concept, sketched.', 'Sketch'), image(8, 'Built into a working chat flow.', 'Prototyped'), image(9, 'Combined into an interactive award map.', 'Polished'),
        ] },
        { type: 'text', paragraphs: ['Usability testing on this direction surfaced real friction — the map tested unevenly and “Sweet Spots” added confusion rather than clarity.'] },
        { type: 'cards', columns: 2, items: [
          { quote: 'Confusing because [I’ve] never used a map feature to book a flight... would prefer manual search.', attribution: 'Johann, usability test' },
          { quote: 'Did not like sweet spots, found it confusing', attribution: 'Gabriela, usability test', body: 'The map itself tested well for this participant.' },
        ] },
        { type: 'gallery', images: [image(10, 'A filtered list, faster to scan and compare points across airlines.', 'Shipped')] },
        { type: 'text', paragraphs: ['We shipped a simpler, guided step-by-step flow instead, and kept the conversational format for a lighter-weight AI Concierge feature rather than the core report.'] },
        { type: 'text', heading: '03 / A utility-first pitch → a warmer invitation to travel' },
        { type: 'cards', columns: 2, items: [
          { title: 'V1', quote: 'Sit back, relax, and let AI do it for you.' },
          { title: 'V2 — shipped', quote: 'No matter where you want to go, Point.ly gets you there.', emphasis: true },
        ] },
        { type: 'text', paragraphs: ['V2’s outcome-first framing — leading with the destination, not the automation — tested better and shipped as the final homepage.'] },
        { type: 'text', heading: 'Designing a cohesive product', paragraphs: ['As part of the prototyping team, I worked across individual experiences and the visual system connecting them.'] },
        { type: 'list', items: [
          'I established the product’s visual direction. I defined typography, color, illustration, and layout principles that became a shared foundation for the team.',
          'I designed key entry and discovery experiences. I owned the Homepage and Explore experience, shaping how users understood Point.ly and discovered travel possibilities.',
          'I translated research into prototypes. I helped turn user insights and product requirements into low-fidelity flows that we could evaluate and refine before higher-fidelity execution.',
        ] },
        { type: 'text', paragraphs: ['Because multiple designers owned different parts of Point.ly, the shared visual language helped turn individually designed features into a more cohesive product.', 'That direction was informed by research into existing AI travel platforms (Mindtrip, Navan, Layla) and aspirational retail brands, converging on a feel the team summarized as “trustworthy, fun, luxury, minimalistic” — then codified into a type and color system.'] },
        { type: 'gallery', images: [image(11, 'The type scale and color system used across the product.', 'Visual system')] },
        { type: 'text', heading: 'Onboarding, from first draft to final' },
        { type: 'gallery', columns: 2, images: [image(12, 'Generic sign-up, no product branding yet.', 'First draft'), image(13, 'Early “Travel Profile Report” concept, before the final visual system.', 'First draft')] },
        { type: 'text', heading: 'A more guided, on-brand experience' },
        { type: 'gallery', columns: 2, images: [
          image(14, 'On-brand home airport step, matching the shipped navigation.', 'Final'),
          image(15, 'Adding credit card points, with more than one card supported.', 'Final'),
          image(16, 'Asking the user’s goal, to tailor later recommendations.', 'Final'),
          image(17, '“(On)Boarding Complete” — straight into flight search.', 'Final'),
        ] },
        { type: 'text', heading: 'From research to working code', paragraphs: ['The project culminated in a one-day AI design hackathon focused on moving from validated research to a functional prototype.'] },
        { type: 'list', items: [
          'Research became a PRD before it became code. We translated user needs and product decisions into requirements so AI was building toward a defined product direction rather than generating solutions from scratch.',
          'AI accelerated the build and introduced a new iteration loop. Using Cursor and Claude, we prompted, evaluated, adjusted, and regenerated the experience as we moved from the PRD to working code. We also experimented with Gemini to compare approaches.',
          'By the end of the day, we had something users could actually interact with. The hackathon compressed the path from research to functional prototype while keeping user needs and design judgment at the center of the process.',
        ] },
        { type: 'gallery', images: [image(18, 'The UX@Berkeley team on hackathon day.')] },
      ],
    },
    {
      id: 'outcomes', type: 'outcomes', title: 'Outcomes', headline: 'Research made tangible.',
      intro: 'Point.ly became a working MVP demonstrating a more connected approach to points-based travel.',
      blocks: [{ type: 'cards', columns: 2, items: [
        { title: 'One experience connected fragmented rewards.', body: 'Points, preferences, and booking options came together within a shared planning flow.' },
        { title: 'Complex redemption choices became more actionable.', body: 'The concept helped users compare ways to book and identify alternatives when their preferred option was out of reach.' },
        { title: 'A shared design language unified the product.', body: 'The visual direction I established gave multiple designers a common foundation for building the MVP.' },
        { title: 'Research moved beyond screens into working code.', body: 'Our hackathon translated user insights and a defined PRD into a functional AI-assisted prototype that could be demonstrated and tested.' },
      ] }],
    },
    {
      id: 'reflection', type: 'reflection', title: 'Reflection', headline: 'Listen. Synthesize. Build. Test. Iterate.',
      intro: 'Interviewing travelers with different habits and levels of points expertise taught me to look for patterns across very different perspectives and translate them into product decisions.',
      blocks: [{ type: 'text', paragraphs: ['The hackathon pushed that process further. I translated our research into a PRD, used AI coding tools to build and iterate on a working experience, and tested its usability with users. The biggest lesson was experiencing the full loop: listen, synthesize, build, test, and iterate.'] }],
    },
  ],
};
