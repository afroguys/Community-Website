import { useEffect, useState } from 'react';
import Styles from './Copyright.module.css';
const Copyright = () => {
    const [taman, setTaman] = useState('Digital Society');
    useEffect(() => {
        fetch('/api/public/settings').then(r=>r.json()).then(d => {
            if (d.nama_taman) setTaman(d.nama_taman);
        }).catch(() => {});
    }, []);
    return (
        <div className={Styles.copyright}>
            <p>{taman} &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </div>
    );
};
export default Copyright;
