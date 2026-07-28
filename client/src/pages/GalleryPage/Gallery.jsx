import { useState, useEffect } from 'react';
import { getGalleryImages } from '../../http';
import Styles from "./Gallery.module.css";


const Gallery = () => {
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    document.title = 'Aktiviti Taman - Digital Society';
    async function load() {
      const { data } = await getGalleryImages({ category: 'aktiviti' });
      setImages(data.images || []);
    }
    load();
  }, []);

  function openLightbox(img) { setLightbox(img); }
  function closeLightbox() { setLightbox(null); }

  return (
    <>
      <div className='gallery container container-margin-top'>
        <h2 className='heading'>🏃 Aktiviti Taman</h2>
        <div className={Styles.gallery}>
          {images.map((img, i) => (
            <div className={Styles.pics} key={img._id || i} onClick={() => openLightbox(img)}>
              <img src={img.image} alt={img.title} style={{ width: '100%' }} />
              {img.title && <p style={{ textAlign: 'center', marginTop: 5 }}>{img.title}</p>}
            </div>
          ))}
          {images.length === 0 && <p style={{ textAlign: 'center' }}>Tiada gambar aktiviti lagi.</p>}
        </div>
      </div>

      {lightbox && (
        <div className={Styles.overlay} onClick={closeLightbox}>
          <span className={Styles.closeBtn} onClick={closeLightbox}>&times;</span>
          <div className={Styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} alt={lightbox.title} className={Styles.lightboxImg} />
            {lightbox.title && <p className={Styles.lightboxTitle}>{lightbox.title}</p>}
          </div>
        </div>
      )}


    </>
  );
};

export default Gallery;
