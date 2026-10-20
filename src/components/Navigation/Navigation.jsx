import './Navigation.css';

export default function Navigation({ onAbout, onContact, workHref = '#work' }) {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a href={workHref}>Work</a>
      <button type="button" onClick={onAbout}>About</button>
      <button type="button" onClick={onContact}>Contact</button>
    </nav>
  );
}
