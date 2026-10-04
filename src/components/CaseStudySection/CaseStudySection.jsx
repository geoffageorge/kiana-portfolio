import CaseStudyGallery from '../CaseStudyGallery/CaseStudyGallery.jsx';
import CaseStudyCards from '../CaseStudyCards/CaseStudyCards.jsx';
import './CaseStudySection.css';

export default function CaseStudySection({ section, number, onOpenImage }) {
  return (
    <section id={section.id} className={`case-section case-section--${section.type}`} aria-labelledby={`${section.id}-title`}>
      <header className="case-section__header">
        <p className="eyebrow">{String(number).padStart(2, '0')} / {section.title}</p>
        <h2 id={`${section.id}-title`}>{section.headline}</h2>
        {section.intro && <p className="case-section__intro">{section.intro}</p>}
      </header>
      <div className="case-section__blocks">
        {section.blocks.map((block, index) => (
          <div className={`case-block case-block--${block.type}`} key={block.id ?? index}>
            {block.heading && <h3 className="case-block__heading" id={block.id}>{block.heading}</h3>}
            {block.type === 'text' && block.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {block.type === 'list' && <ul className="case-list" data-columns={block.columns ?? 1}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>}
            {block.type === 'quote' && <blockquote className="case-insight"><p>{block.text}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>}
            {block.type === 'cards' && <CaseStudyCards items={block.items} columns={block.columns} variant={block.variant} />}
            {block.type === 'gallery' && <CaseStudyGallery images={block.images} columns={block.columns} onOpenImage={onOpenImage} />}
          </div>
        ))}
      </div>
    </section>
  );
}
