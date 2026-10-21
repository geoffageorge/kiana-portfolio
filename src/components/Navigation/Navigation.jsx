import './Navigation.css';

export default function Navigation({ aboutHref, workHref = '#work', aboutActive = false }) {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a href={workHref}><span className="site-nav__label">Work</span></a>
      <a href={aboutHref} aria-current={aboutActive ? 'page' : undefined}><span className="site-nav__label">About+Contact</span></a>
    </nav>
  );
}
