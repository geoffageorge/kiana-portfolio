import { useEffect } from 'react';
import './PortfolioSectionPages.css';

export default function VideoPage() {
  useEffect(() => { document.title = 'Video / Kiana George'; }, []);
  return <section className="video-page" aria-labelledby="video-title"><h1 id="video-title">VIDEO</h1></section>;
}
