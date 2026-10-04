import './CaseStudyCards.css';

export default function CaseStudyCards({ items, columns = 3, variant }) {
  return <div className="case-cards" data-columns={columns} data-variant={variant}>
    {items.map((item, index) => <div className={`case-card${item.emphasis ? ' case-card--emphasis' : ''}`} key={item.title ?? item.quote}>
      {variant === 'personas' && <p className="case-card__number eyebrow">Profile {String(index + 1).padStart(2, '0')}</p>}
      {item.title && <h3>{item.title}</h3>}
      {item.body && <p>{item.body}</p>}
      {item.quote && <blockquote><p>“{item.quote}”</p>{item.attribution && <cite>{item.attribution}</cite>}</blockquote>}
    </div>)}
  </div>;
}
