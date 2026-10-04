import { useCallback, useState } from 'react';
import SiteHeader from './components/SiteHeader/SiteHeader.jsx';
import HeroSection from './components/HeroSection/HeroSection.jsx';
import SelectedWork from './components/SelectedWork/SelectedWork.jsx';
import SiteFooter from './components/SiteFooter/SiteFooter.jsx';
import Modal from './components/Modal/Modal.jsx';
import { site } from './data/site.js';
import { projects } from './data/projects.js';

export default function App() {
  const [dialog, setDialog] = useState(null);
  const closeDialog = useCallback(() => setDialog(null), []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader
        site={site}
        onAbout={() => setDialog({ kind: 'about', title: 'A little about me' })}
        onResume={() => setDialog({ kind: 'resume', title: 'Résumé coming soon' })}
      />
      <main id="main" className="page-container" tabIndex={-1}>
        <HeroSection site={site} />
        <SelectedWork projects={projects} onSelect={(project) => setDialog({ kind: 'project', title: `Project ${project.number}`, project })} />
      </main>
      <SiteFooter site={site} onLinkedIn={() => setDialog({ kind: 'linkedin', title: 'Let’s connect' })} />
      <Modal open={Boolean(dialog)} onClose={closeDialog} title={dialog?.title ?? ''}>
        {dialog?.kind === 'about' && (
          <div className="modal-copy">
            <p className="eyebrow">Kiana George / UX design + insights</p>
            <p>I’m interested in turning complex problems into intuitive, thoughtful experiences that feel good to use.</p>
            <p>My interests in fitness, movement, food, and nutrition shape the kinds of experiences I want to create. I enjoy collaborating with teams and bringing clarity to the design process.</p>
            <a className="text-link" href={`mailto:${site.email}`}>Get in touch <span aria-hidden="true">↗</span></a>
          </div>
        )}
        {dialog?.kind === 'resume' && (
          <div className="modal-copy">
            <p>My résumé will be available here soon. In the meantime, feel free to get in touch.</p>
            <a className="text-link" href={`mailto:${site.email}`}>{site.email} <span aria-hidden="true">↗</span></a>
          </div>
        )}
        {dialog?.kind === 'linkedin' && (
          <div className="modal-copy">
            <p>My LinkedIn profile will be added soon. You can reach me by email in the meantime.</p>
            <a className="text-link" href={`mailto:${site.email}`}>{site.email} <span aria-hidden="true">↗</span></a>
          </div>
        )}
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
