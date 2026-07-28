import { useState, useEffect } from 'react';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '../../../../http';
import Styles from './GalleryManager.module.css';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const { data } = await getGalleryImages({ category: 'aktiviti' });
        setImages(data.images || []);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!file) { setMsg('Please select an image'); return; }
        const reader = new FileReader();
        reader.onload = async () => {
            const { data } = await addGalleryImage({ title, category: 'aktiviti', image: reader.result });
            setMsg(data.done ? '✅ Aktiviti Taman uploaded!' : '❌ Upload failed');
            setTitle(''); setFile(null);
            load();
        };
        reader.readAsDataURL(file);
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this image?')) return;
        await deleteGalleryImage({ id });
        load();
    }

    return (
        <div className={Styles.wrapper}>
            <h2>🏃 Aktiviti Taman</h2>
            {msg && <p style={{ color: msg.includes('✅') ? 'green' : 'red' }}>{msg}</p>}
            <form onSubmit={handleSubmit} className={Styles.form}>
                <input type="text" placeholder="Tajuk gambar" value={title} onChange={e => setTitle(e.target.value)} required />
                <div className={Styles.fileWrap}>
                    <label className={Styles.fileLabel}>📁 Pilih Gambar
                        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required style={{ display: 'none' }} />
                    </label>
                    {file && <span className={Styles.fileName}>{file.name}</span>}
                </div>
                <button type="submit">📤 Upload</button>
            </form>
            <div className={Styles.grid}>
                {images.length === 0 && <p>Tiada gambar aktiviti lagi.</p>}
                {images.map(img => (
                    <div key={img._id} className={Styles.card}>
                        <img src={img.image} alt={img.title} />
                        <p><strong>{img.title}</strong></p>
                        <button onClick={() => handleDelete(img._id)} className={Styles.del}>🗑️ Padam</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default GalleryManager;
