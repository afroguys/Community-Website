import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./textAnimation.css";
import Styles from "./HeroSection.module.css";
import anime from "animejs/lib/anime.min.js";
import { useGlobalContext } from "../../../context/context";

const HeroSection = () => {
  const { isAuth, siteSettings } = useGlobalContext();
  const taman = siteSettings.nama_taman || 'Taman Kita';
  const persatuan = siteSettings.nama_persatuan || 'Persatuan Penduduk';
  const moto = siteSettings.moto || 'Komuniti Harmoni & Sejahtera';
  const photo1 = siteSettings.main_photo_1 || './images/img/house.webp';
  const photo2 = siteSettings.main_photo_2 || './images/img/residency.webp';

  useEffect(() => {
    const wrapper = document.querySelector(".hero-heading .letters");
    if (!wrapper) return;
    wrapper.innerHTML = wrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    anime.timeline({ loop: false }).add({
      targets: ".hero-heading .letter",
      translateY: ["1.1em", 0],
      translateZ: 0,
      duration: 750,
      delay: (el, i) => 70 * i,
    });
  }, [siteSettings]);

  return (
    <div className={`${Styles.heroWrapper} container`}>
      <div className={Styles.rightSide}>
        <h1 className="hero-heading">
          <span className="text-wrapper">
            <span className="letters">{taman.toUpperCase()}</span>
          </span>
        </h1>
        <h3>{persatuan}</h3>
        <p>{moto}</p>
        <button className={`btnStructure ${Styles.btn}`}>
          <span><Link to='/register'>{!isAuth ? 'Daftar' : 'GO TO PROFILE'}</Link></span>
          <div><img src="./images/icons/arrow.svg" alt="" /></div>
        </button>
      </div>
      <div className={Styles.leftSide}>
        <img src={photo1} data-aos="fade-down" className={Styles.houseImg} alt="" />
        <img src={photo2} data-aos="fade-left" className={Styles.residencyImg} alt="" />
      </div>
    </div>
  );
};

export default HeroSection;
