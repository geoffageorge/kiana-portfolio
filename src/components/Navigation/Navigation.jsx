import './Navigation.css';

export default function Navigation({ resumeUrl, onAbout, onResume }) {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a href="#work">Work</a>
      <button type="button" onClick={onAbout}>About</button>
      {resumeUrl ? <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Resume</a> : <button type="button" onClick={onResume}>Resume</button>}
      <a href="#contact">Contact</a>
    </nav>
  );
}
