export default function ContactContent({ site }) {
  return (
    <address className="contact-content">
      <a className="contact-content__row" href={site.phoneUrl}>
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="24" rx="2.5" /><path d="M9 5h6M11 22h2" /></svg>
        <span>{site.phone}</span>
      </a>
      <a className="contact-content__row" href={`mailto:${site.email}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></svg>
        <span>{site.email}</span>
      </a>
    </address>
  );
}
