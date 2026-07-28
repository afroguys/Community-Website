import { useState, useEffect } from 'react';
import Styles from './Announcement.module.css';

const AnnouncementPage = () => {
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        document.title = 'Pengumuman - Taman';
        fetch('/api/public/announcements')
            .then(r => r.json())
            .then(d => setList(d.announcements || []))
            .catch(() => {});
    }, []);

    return (
        <div className="container container-margin-top">
            <h1 className="heading">📢 Pengumuman</h1>

            {selected ? (
                <div className={Styles.detail}>
                    <button className={Styles.back} onClick={() => setSelected(null)}>← Kembali</button>
                    <h2>{selected.title}</h2>
                    <small>{new Date(selected.createdAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
                    <hr />
                    <div className={Styles.content} dangerouslySetInnerHTML={{ __html: selected.content }} />
                </div>
            ) : (
                <div className={Styles.list}>
                    {list.map(a => (
                        <div key={a._id} className={Styles.card} onClick={() => setSelected(a)}>
                            <h3>{a.title}</h3>
                            <div className={Styles.excerpt} dangerouslySetInnerHTML={{ __html: a.content.substring(0, 150) }} />
                            <div className={Styles.meta}>
                                <span>{new Date(a.createdAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span className={Styles.readMore}>Baca selengkapnya →</span>
                            </div>
                        </div>
                    ))}
                    {list.length === 0 && <p style={{ textAlign: 'center' }}>Tiada pengumuman lagi.</p>}
                </div>
            )}
        </div>
    );
};
export default AnnouncementPage;
