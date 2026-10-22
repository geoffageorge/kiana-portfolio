import BrandName from '../BrandName/BrandName.jsx';
import { assetUrl, siteUrl } from '../../lib/urls.js';
import './SiteFooter.css';

export default function SiteFooter({ site }) {
  return (
    <footer className="site-footer" id="contact" aria-label="Contact" data-figma-node="523:49">
      <div className="site-footer__inner page-container">
        <a href="#top" className="site-footer__brand" aria-label={`${site.name}, back to top`}><img src={assetUrl('brand/ki-logo-v4.svg')} alt="" width="57" height="38" aria-hidden="true" data-figma-node="523:41" /><BrandName name={site.name} descriptor={site.descriptor} /></a>
        <a className="site-footer__connect" href={siteUrl('about/')} data-figma-node="523:39">LET’S<br />CONNECT <span aria-hidden="true">↗</span></a>
      </div>
    </footer>
  );
}
