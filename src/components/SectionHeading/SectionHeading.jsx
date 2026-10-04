import './SectionHeading.css';

export default function SectionHeading({ id, title, subtitle }) {
  return <div className="section-heading"><h2 id={id}>{title}</h2><p className="eyebrow">{subtitle}</p></div>;
}
