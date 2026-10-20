import { lazy, Suspense, useCallback, useState } from 'react';
import SiteHeader from './components/SiteHeader/SiteHeader.jsx';
import HeroSection from './components/HeroSection/HeroSection.jsx';
import SelectedWork from './components/SelectedWork/SelectedWork.jsx';
import SiteFooter from './components/SiteFooter/SiteFooter.jsx';
import Modal from './components/Modal/Modal.jsx';
import AboutContent from './components/Modal/AboutContent.jsx';
import ContactContent from './components/Modal/ContactContent.jsx';
import { site } from './data/site.js';
import { projects } from './data/projects.js';
import { currentProjectSlug, siteUrl } from './lib/urls.js';
import { useInitialHashNavigation } from './lib/useInitialHashNavigation.js';

const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage.jsx'));
const PointlyCaseStudyPage = lazy(() => import('./pages/PointlyCaseStudyPage.jsx'));
const ObayashiCaseStudyPage = lazy(() => import('./pages/ObayashiCaseStudyPage.jsx'));

export default function App() {
  useInitialHashNavigation();
  const [dialog, setDialog] = useState(null);
  const closeDialog = useCallback(() => setDialog(null), []);
  const projectSlug = currentProjectSlug();
  const isPointly = projectSlug === 'pointly';
  const isObayashi = projectSlug === 'obayashi';
  const ProjectPage = isPointly ? PointlyCaseStudyPage : isObayashi ? ObayashiCaseStudyPage : CaseStudyPage;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader
        variant={isPointly ? 'pointly' : isObayashi ? 'obayashi' : 'default'}
        site={site}
        homeHref={projectSlug ? siteUrl() : '#top'}
        workHref={projectSlug ? `${siteUrl()}#work` : '#work'}
        onAbout={(event) => setDialog({ kind: 'about', title: 'Curious George, Literally', returnFocus: event.currentTarget })}
        onContact={(event) => setDialog({ kind: 'contact', title: 'Contact Kiana George', returnFocus: event.currentTarget })}
      />
      <main id="main" className={`page-container${isPointly || isObayashi ? ' page-container--case-study' : ''}`} tabIndex={-1}>
        {projectSlug ? (
          <Suspense fallback={<p className="case-loading" role="status">Loading project…</p>}>
            <ProjectPage slug={projectSlug} onOpenImage={(image) => setDialog({ kind: 'image', title: image.alt, image })} />
          </Suspense>
        ) : <><HeroSection site={site} /><SelectedWork projects={projects} onSelect={(project) => setDialog({ kind: 'project', title: `Project ${project.number}`, project })} /></>}
      </main>
      <SiteFooter site={site} />
      <Modal open={Boolean(dialog)} onClose={closeDialog} returnFocus={dialog?.returnFocus} title={dialog?.title ?? ''} className={dialog?.kind === 'image' ? 'portfolio-modal--image' : ['about', 'contact'].includes(dialog?.kind) ? `portfolio-modal--profile portfolio-modal--${dialog.kind}` : ''}>
        {dialog?.kind === 'image' && <div className="modal-copy">
          <img className="modal-evidence-image" src={dialog.image.src} alt={dialog.image.alt} width={dialog.image.width ?? 1200} height={dialog.image.height ?? 750} />
          {dialog.image.caption && <p className="modal-image-caption">{dialog.image.caption}</p>}
          <a className="text-link" href={dialog.image.src} target="_blank" rel="noopener noreferrer">Open full-size image <span aria-hidden="true">↗</span></a>
        </div>}
        {dialog?.kind === 'about' && <AboutContent site={site} />}
        {dialog?.kind === 'contact' && <ContactContent site={site} />}
        {dialog?.kind === 'project' && (
          <div className="modal-copy">
            <img className="modal-project-image" src={dialog.project.image} alt={dialog.project.imageAlt} style={{ objectPosition: dialog.project.imagePosition ?? 'center' }} width="640" height="640" />
            <p className="eyebrow">{dialog.project.category} / Case study coming soon</p>
            <p>{dialog.project.description}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
