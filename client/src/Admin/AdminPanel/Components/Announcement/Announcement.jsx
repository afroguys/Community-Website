import { useState, useEffect, useRef } from 'react';
import Styles from './Announcement.module.css';

const API = '/api/admin/addAnnouncement';
const GET = '/api/public/announcements';
const DEL = '/api/admin/deleteAnnouncement';

const Announcement = () => {
    const [list, setList] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [msg, setMsg] = useState('');
    const [editorReady, setEditorReady] = useState(false);
    const editorRef = useRef(null);
    const editorInstanceRef = useRef(null);

    useEffect(() => { load(); }, []);

    // Load CKEditor 5 from CDN
    useEffect(() => {
        if (document.querySelector('script[src*="ckeditor5-build-classic"]')) {
            setEditorReady(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js';
        script.onload = () => setEditorReady(true);
        document.head.appendChild(script);
    }, []);

    // Initialize CKEditor when ready
    useEffect(() => {
        if (!editorReady || !editorRef.current || editorInstanceRef.current) return;
        // eslint-disable-next-line no-undef
        ClassicEditor.create(editorRef.current, {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'blockQuote', 'insertTable', 'undo', 'redo'],
            placeholder: 'Tulis pengumuman di sini...',
        }).then(editor => {
            editorInstanceRef.current = editor;
            editor.model.document.on('change:data', () => {
                setContent(editor.getData());
            });
        }).catch(err => console.error('CKEditor error:', err));

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy().catch(() => {});
                editorInstanceRef.current = null;
            }
        };
    }, [editorReady]);

    async function load() {
        try {
            const r = await fetch(GET); const d = await r.json();
            setList(d.announcements || []);
        } catch (e) { console.error(e); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !content.trim()) { setMsg('❌ Sila isi tajuk & kandungan'); return; }
        try {
            const r = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            const d = await r.json();
            setMsg(d.done ? '✅ Pengumuman disimpan!' : '❌ Gagal simpan');
            setTitle('');
            if (editorInstanceRef.current) editorInstanceRef.current.setData('');
            load();
        } catch (e) { setMsg('❌ Ralat rangkaian'); }
    }

    async function handleDelete(id) {
        if (!window.confirm('Padam pengumuman ini?')) return;
        try {
            await fetch(DEL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            load();
        } catch (e) { }
    }

    return (
        <div className={Styles.wrapper}>
            <h2 className='heading'>📢 Pengumuman</h2>
            {msg && <p style={{ color: msg.includes('✅') ? 'green' : 'red' }}>{msg}</p>}
            <form onSubmit={handleSubmit} className={Styles.form}>
                <input type="text" placeholder="Tajuk Pengumuman" value={title} onChange={e => setTitle(e.target.value)} required />
                <div ref={editorRef} className={Styles.editor}></div>
                {!editorReady && <p style={{ color: '#999' }}>⏳ Loading editor...</p>}
                <button type="submit" className="btnStructure">📤 Terbitkan</button>
            </form>
            <hr />
            <div className={Styles.list}>
                {list.length === 0 && <p>Tiada pengumuman lagi.</p>}
                {list.map(a => (
                    <div key={a._id} className={Styles.card}>
                        <button className={Styles.del} onClick={() => handleDelete(a._id)}>🗑️</button>
                        <h3>{a.title}</h3>
                        <div className={Styles.preview} dangerouslySetInnerHTML={{ __html: a.content.substring(0, 200) }} />
                        <small>{new Date(a.createdAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Announcement;
