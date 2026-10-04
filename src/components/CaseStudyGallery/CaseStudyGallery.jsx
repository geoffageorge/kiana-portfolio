import './CaseStudyGallery.css';

export default function CaseStudyGallery({ images, columns = 1, onOpenImage }) {
  return (
    <div className="case-gallery" data-columns={columns}>
      {images.map((image, index) => (
        <figure key={`${image.src}-${index}`}>
          {image.stage && <p className="case-gallery__stage eyebrow">{image.stage}</p>}
          <button type="button" className="case-gallery__image" onClick={() => onOpenImage(image)} aria-label={`Enlarge ${image.alt}`}>
            <img src={image.src} alt={image.alt} width={image.width ?? 1200} height={image.height ?? 750} loading="lazy" decoding="async" />
            <span aria-hidden="true">↗</span>
          </button>
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
