import Styles from './Settings.module.css';
import { adminSetting } from '../../../../http';
import { Loader } from '../../../../import';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../../context/context';

const Settings = ({refresh}) => {
    const ctx = useGlobalContext();
    const refreshSiteSettings = ctx?.refreshSiteSettings;
    const [loading,setLoading]=useState(false);
    const [adminData,setAdminData]=useState('');
    const [showForm,setShowForm]=useState(false);
    const [formData,setFormData]=useState({
        societyCode:'',adminCode:'',img:'',name:'',
        nama_persatuan:'',nama_taman:'',moto:'',logo_img:'',icon_img:'',
        contact_email:'',contact_address:'',
        main_photo_1:'',main_photo_2:'',
    });

    async function getInfo(){
        setLoading(true);
        const {data} = await adminSetting();
        if(data) { setAdminData(data); setFormData(data); }
        setLoading(false);
    }

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function captureImg(e, field) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            setFormData(prev => ({ ...prev, [field]: reader.result }));
        };
    }

    async function submit(e){
        e.preventDefault();
        setLoading(true);
        try {
            // Don't send admin photo img through settings (too large)
            const toSave = {...formData};
            delete toSave.img;
            const {data} = await adminSetting({data:toSave,edit:true});
            if(data){ getInfo(); refresh(); if (refreshSiteSettings) refreshSiteSettings(); window.location.reload(); }
            setShowForm(false);
        } catch (err) {
            console.error('Save failed:', err);
            setLoading(false);
        }
    }

    useEffect(() => { getInfo(); }, []);

    return loading ? <Loader message='loading' type='true'/> : (
        <div className={Styles.settingWrapper}>
            <h2 className='heading'>Settings</h2>
            {showForm ? (
                <form className='box-shadow' onSubmit={submit} style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h3 style={{ marginTop: 0 }}>Admin</h3>
                    <div className={Styles.profile}>
                        <img src={formData.img} alt="" />
                        <label htmlFor="img">change admin photo</label>
                        <input type="file" id='img' name='img' onChange={(e) => captureImg(e, 'img')} />
                    </div>
                    <div><label>Name</label><input type="text" value={formData.name} onChange={handleChange} name="name" required /></div>
                    <div><label>Society code</label><input type="text" value={formData.societyCode} maxLength='6' onChange={handleChange} name="societyCode" required /></div>
                    <div><label>Admin code</label><input type="text" value={formData.adminCode} maxLength='6' onChange={handleChange} name="adminCode" required /></div>

                    <hr />
                    <h3>🏘️ Profil Taman</h3>
                    <div><label>Nama Persatuan</label><input type="text" value={formData.nama_persatuan} onChange={handleChange} name="nama_persatuan" required /></div>
                    <div><label>Nama Taman</label><input type="text" value={formData.nama_taman} onChange={handleChange} name="nama_taman" required /></div>
                    <div><label>Moto</label><input type="text" value={formData.moto} onChange={handleChange} name="moto" required /></div>
                    <div className={Styles.profile}>
                        <label htmlFor="logo_img" style={{ cursor: 'pointer', color: '#1069ff', fontWeight: 600 }}>
                            📁 Pilih Logo Taman
                        </label>
                        {formData.logo_img && <img src={formData.logo_img} alt="" style={{ width: 60, height: 60, objectFit: 'contain', display: 'block' }} />}
                        <input type="file" id="logo_img" accept="image/*" onChange={(e) => captureImg(e, 'logo_img')} style={{ display: 'none' }} />
                    </div>
                    <div className={Styles.profile}>
                        <label htmlFor="icon_img" style={{ cursor: 'pointer', color: '#1069ff', fontWeight: 600 }}>
                            📁 Pilih Ikon Taman
                        </label>
                        {formData.icon_img && <img src={formData.icon_img} alt="" style={{ width: 40, height: 40, objectFit: 'contain', display: 'block' }} />}
                        <input type="file" id="icon_img" accept="image/*" onChange={(e) => captureImg(e, 'icon_img')} style={{ display: 'none' }} />
                    </div>

                    <hr />
                    <h3>🏠 Gambar Utama</h3>
                    <div className={Styles.profile}>
                        <label htmlFor="main_photo_1" style={{ cursor: 'pointer', color: '#1069ff', fontWeight: 600 }}>📁 Gambar Utama 1</label>
                        {formData.main_photo_1 && <img src={formData.main_photo_1} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />}
                        {!formData.main_photo_1 && <span style={{ fontSize: 12, color: '#999' }}>Default: house.webp</span>}
                        <input type="file" id="main_photo_1" accept="image/*" onChange={(e) => captureImg(e, 'main_photo_1')} style={{ display: 'none' }} />
                    </div>
                    <div className={Styles.profile}>
                        <label htmlFor="main_photo_2" style={{ cursor: 'pointer', color: '#1069ff', fontWeight: 600 }}>📁 Gambar Utama 2</label>
                        {formData.main_photo_2 && <img src={formData.main_photo_2} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />}
                        {!formData.main_photo_2 && <span style={{ fontSize: 12, color: '#999' }}>Default: residency.webp</span>}
                        <input type="file" id="main_photo_2" accept="image/*" onChange={(e) => captureImg(e, 'main_photo_2')} style={{ display: 'none' }} />
                    </div>

                    <hr />
                    <h3>📞 Hubungi</h3>
                    <div><label>Email</label><input type="email" value={formData.contact_email} onChange={handleChange} name="contact_email" /></div>
                    <div><label>Alamat</label><input type="text" value={formData.contact_address} onChange={handleChange} name="contact_address" /></div>

                    <div className={Styles.btns}>
                        <button onClick={() => setShowForm(false)} className={`btnStructure ${Styles.cancelBtn}`}>Cancel</button>
                        <button type='submit' className={`btnStructure ${Styles.submitBtn}`}>💾 Simpan</button>
                    </div>
                </form>
            ) : (
                <div className={Styles.cardGrid}>
                    <div className={`${Styles.setting} box-shadow`}>
                        <img src={adminData.img} alt="" />
                        <h3>{adminData.name}</h3>
                        <h4>👤 Admin</h4>
                        <p>Code: <span>{adminData.societyCode}</span></p>
                    </div>
                    <div className={`${Styles.setting} box-shadow`}>
                        <h3>🏘️ {adminData.nama_taman || '-'}</h3>
                        <h4>{adminData.nama_persatuan || '-'}</h4>
                        <p><em>{adminData.moto || '-'}</em></p>
                    </div>
                    <div className={`${Styles.setting} box-shadow`}>
                        <h3>📞 Contact</h3>
                        <p>Email: <span>{adminData.contact_email || '-'}</span></p>
                        <p>Alamat: <span>{adminData.contact_address || '-'}</span></p>
                    </div>
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                        <button onClick={() => setShowForm(true)} className={`btnStructure ${Styles.btn}`}>✏️ Edit Settings</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
