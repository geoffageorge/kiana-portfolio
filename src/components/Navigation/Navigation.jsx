import './Navigation.css';

export default function Navigation({ uxHref, videoHref, journalismHref, aboutHref, activePage }) {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      {[
        ['ux', 'UX', uxHref], ['video', 'VIDEO', videoHref],
        ['journalism', 'JOURNALISM', journalismHref], ['about', 'ABOUT+CONTACT', aboutHref],
      ].map(([key, label, href]) => <a key={key} href={href} aria-current={activePage === key ? 'page' : undefined}><span className="site-nav__label">{label}</span></a>)}
    </nav>
  );
}
