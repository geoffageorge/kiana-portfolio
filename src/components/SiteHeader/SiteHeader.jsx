import { useLayoutEffect, useRef } from 'react';
import Logo from '../Logo/Logo.jsx';
import BrandName from '../BrandName/BrandName.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import './SiteHeader.css';

export default function SiteHeader({ site, onAbout, onResume, homeHref = '#top', workHref = '#work' }) {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const updateHeight = () => document.documentElement.style.setProperty('--site-header-height', `${headerRef.current.getBoundingClientRect().height}px`);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--site-header-height');
    };
  }, []);

  return (
    <>
      <div id="top" aria-hidden="true" />
      <header ref={headerRef} className="site-header">
        <div className="site-header__inner page-container">
          <a className="site-header__brand flex items-center" href={homeHref} aria-label={`${site.name} home`}>
            <Logo />
            <BrandName name={site.name} descriptor={site.descriptor} />
          </a>
          <Navigation resumeUrl={site.resumeUrl} onAbout={onAbout} onResume={onResume} workHref={workHref} />
        </div>
      </header>
    </>
  );
}
