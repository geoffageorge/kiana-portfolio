import Logo from '../Logo/Logo.jsx';
import BrandName from '../BrandName/BrandName.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import './SiteHeader.css';

export default function SiteHeader({ site, onAbout, onResume, homeHref = '#top', workHref = '#work' }) {
  return (
    <header className="site-header page-container" id="top">
      <a className="site-header__brand flex items-center" href={homeHref} aria-label={`${site.name} home`}>
        <Logo />
        <BrandName name={site.name} descriptor={site.descriptor} />
      </a>
      <Navigation resumeUrl={site.resumeUrl} onAbout={onAbout} onResume={onResume} workHref={workHref} />
    </header>
  );
}
