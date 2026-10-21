import { useLayoutEffect, useRef } from 'react';
import Logo from '../Logo/Logo.jsx';
import PointlyMark from '../Logo/PointlyMark.jsx';
import BrandName from '../BrandName/BrandName.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import { assetUrl } from '../../lib/urls.js';
import './SiteHeader.css';

export default function SiteHeader({ site, aboutHref, aboutActive = false, homeHref = '#top', workHref = '#work', variant = 'default' }) {
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
      <header ref={headerRef} className={`site-header${variant !== 'default' ? ` site-header--${variant}` : ''}`}>
        <div className="site-header__inner page-container">
          <a className="site-header__brand flex items-center" href={homeHref} aria-label={`${site.name} home`}>
            {variant === 'obayashi' ? <img className="obayashi-mark" src={assetUrl('obayashi-figma/logo.svg')} width="57" height="38" alt="" aria-hidden="true" data-figma-node="479:58" /> : variant === 'pointly' ? <PointlyMark /> : <Logo />}
            <BrandName name={site.name} descriptor={site.descriptor} />
          </a>
          <Navigation aboutHref={aboutHref} aboutActive={aboutActive} workHref={workHref} />
        </div>
      </header>
    </>
  );
}
