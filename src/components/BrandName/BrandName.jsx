import './BrandName.css';

export default function BrandName({ name, descriptor }) {
  return (
    <span className="brand-name">
      <span>{name}</span>
      <span className="brand-name__descriptor"><span aria-hidden="true"> / </span>{descriptor}</span>
    </span>
  );
}
