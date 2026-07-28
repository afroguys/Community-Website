import Styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../../context/context";

// Footer component
const Footer = () => {
  const { siteSettings } = useGlobalContext();
  const email = siteSettings.contact_email || 'digitalsociety2@gmail.com';
  const address = siteSettings.contact_address || 'Digital Society, Visnagar, India';
  const taman = siteSettings.nama_taman || 'Digital Society';

  return (
    <>
      <div className={`${Styles.footerWrapper}`}>
        <div className={`container ${Styles.footer}`}>
          <div className={`${Styles.aboutSociety}`}>
            <div>
              <h2>Contact us</h2>
              <p>
                <i className="fas fa-envelope"></i>
                <span> {email}</span>
              </p>
              <p style={{ alignItems: 'flex-start' }}>
                <i className="fas fa-map-marker-alt"></i>
                <span>{address}</span>
              </p>
            </div>
          </div>
          <div className={`${Styles.quickLinks}`}>
            <div>
              <h2>Quick Links</h2>
              <ul>
                <Link to="/advertise"><li>Advertise</li></Link>
                <Link to="/gallery"><li>Aktiviti Taman</li></Link>
              </ul>
            </div>
          </div>
          <div className={`${Styles.eventsPlanning}`}>
            <div>
              <h2>Merancang Acara</h2>
              <p>Untuk sebarang acara yang besar dalam taman, dapatkan kebenaran daripada persatuan.</p>
              <a href={`mailto:${email}`} className="btnStructure" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <i className="fas fa-envelope"></i> {email}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={Styles.imagesWarning}>
        <p>{taman} &copy; {new Date().getFullYear()}. All rights reserved.</p>
      </div>
    </>
  );
};

export default Footer;
