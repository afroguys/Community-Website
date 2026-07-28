import { useGlobalContext } from '../../../context/context';
import Styles from './Logo.module.css';

const Logo = () => {
    const { siteSettings } = useGlobalContext();
    const name = siteSettings.nama_taman || 'Digital Society';
    const logo = siteSettings.logo_img || '';

    return (
        <div className={Styles.logo}>
            <h3>
                {logo ? (
                    <img src={logo} alt={name} style={{ height: 28, width: 'auto', marginRight: 8, verticalAlign: 'middle' }} />
                ) : (
                    <i className="fas fa-home"></i>
                )}
                {name}
            </h3>
        </div>
    );
};

export default Logo;
