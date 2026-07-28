import { useState, useEffect } from 'react';
import { getGalleryImages } from '../../../http';
import Styles from "./Gallery.module.css";
import SwiperSlider from "../../shared/swiper-slider/SwiperSlider";
import { Link } from "react-router-dom";

const Gallery = () => {
  const [imgs, setImgs] = useState([]);
  const [imgArray, setImgArray] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await getGalleryImages({ category: 'aktiviti' });
      setImgs(data.images || []);
    }
    load();
  }, []);

  useEffect(() => {
    const arr = imgs.map((img, idx) => (
      <img src={img.image} alt={img.title} key={img._id || idx} className={Styles.img} />
    ));
    arr.push(
      <Link to='/gallery' key='more'>
        <p style={{ color: 'var(--main-color)', fontWeight: '700', fontSize: '18px', cursor: 'pointer', marginLeft: '20px' }}>
          lebih gambar <i style={{ color: 'var(--secondary-color)', marginLeft: '10px' }} className="fas fa-arrow-right"></i>
        </p>
      </Link>
    );
    setImgArray(arr);
  }, [imgs]);

  return (
    <div className="container container-margin-top">
      <h1 className="heading" data-aos="zoom-in">Galeri</h1>
      {imgArray.length > 1 ? <SwiperSlider type="advertise" slideArray={imgArray} /> : <p style={{ textAlign: 'center' }}>Tiada gambar aktiviti lagi.</p>}
    </div>
  );
};

export default Gallery;
