const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`;

export const site = {
  name: 'Kiana George',
  descriptor: 'UX Design + Insights',
  heroTitle: ['Clarifying', 'Chaos'],
  heroDescription: 'Turning hidden insights into intuitive user experiences',
  email: 'kianageo@uw.edu',
  // Set these when the final résumé and LinkedIn profile are available.
  resumeUrl: null,
  linkedInUrl: null,
  heroAnimation: asset('hero/clarifying-chaos.gif'),
  heroPoster: asset('hero/clarifying-chaos-poster.png'),
};
