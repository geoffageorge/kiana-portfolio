import Logo from '../Logo/Logo.jsx';
import BrandName from '../BrandName/BrandName.jsx';
import './SiteFooter.css';

export default function SiteFooter({ site, onLinkedIn }) {
  return (
    <footer className="site-footer" id="contact" aria-label="Contact">
      <div className="site-footer__inner page-container">
        <a href="#top" className="site-footer__brand flex items-center" aria-label={`${site.name}, back to top`}><Logo /><BrandName name={site.name} descriptor={site.descriptor} /></a>
        <div className="site-footer__links">
          {site.linkedInUrl ? <a href={site.linkedInUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a> : <button type="button" onClick={onLinkedIn}>LinkedIn</button>}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
    </footer>
  );
}
