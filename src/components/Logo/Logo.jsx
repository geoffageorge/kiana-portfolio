import { assetUrl } from '../../lib/urls.js';
import './Logo.css';

export default function Logo({ className = '' }) {
  return (
    <img className={`brand-logo ${className}`} src={assetUrl('brand/ki-logo.png')} width="54" height="36" alt="" aria-hidden="true" />
  );
}
