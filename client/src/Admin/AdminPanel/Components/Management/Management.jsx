import { useEffect, useState } from 'react'
import { Loader } from '../../../../import'
import { adminDataOperation } from '../../../../http'
import Styles from './Management.module.css';
import { defaultImg } from '../../../../defaultImg';
import ManagementCard from '../../../../components/HomePageComponents/ManagmentPeoples/Card/Card';

const Management = () => {
    const [loading,setLoading]=useState(false);
    const [showForm,setShowForm]=useState(false);
    const [managementData,setManagementData]=useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData,setFormData]=useState({
        name:'', img:defaultImg || '', phoneno:'', email:'', position:''
    });

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function captureImg(e){
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend=function(){
            setFormData(prev => ({ ...prev, img: reader.result }));
        };
    }

    function openAdd(){
        setEditingIndex(null);
        setFormData({ name:'', img:defaultImg || '', phoneno:'', email:'', position:'' });
        setShowForm(true);
    }

    function openEdit(people, index){
        setEditingIndex(index);
        setFormData({
            name: people.name || '',
            img: people.img || defaultImg || '',
            phoneno: people.phoneno || '',
            email: people.email || '',
            position: people.position || ''
        });
        setShowForm(true);
    }

    async function submit(e){
        e.preventDefault();
        setLoading(true);
        let operationName = 'create';
        let dbData = formData;
        if (editingIndex !== null) {
            operationName = 'update';
            dbData = { index: editingIndex, data: formData };
        }
        const reqData = { operationName, fieldName: 'management', dbData };
        const { data } = await adminDataOperation({ data: reqData });
        if (data) getPeople();
    }

    async function getPeople(){
        setLoading(true);
        const reqData = { fieldName: 'management', operationName: 'get' };
        const { data } = await adminDataOperation({ data: reqData });
        if (data) setManagementData(data);
        setShowForm(false);
        setEditingIndex(null);
        setLoading(false);
    }

    async function deletePeople(people, index){
        setLoading(true);
        const reqData = { fieldName: 'management', operationName: 'delete', dbData: { ...people, index } };
        const { data } = await adminDataOperation({ data: reqData });
        if (data) getPeople();
    }

    useEffect(() => { getPeople(); }, []);

    return (
        <>
            <div className={Styles.managementWrapper}>
                <h2 className='heading'>Management Peoples</h2>
                <div className={Styles.btn}>
                    <button onClick={openAdd} className='btnStructure'>Add People</button>
                </div>
                {loading ? <Loader message='loading...' type='true'/> : (
                    <>
                        {showForm && (
                            <form onSubmit={submit} className='box-shadow'>
                                <h3>{editingIndex !== null ? '✏️ Edit' : '➕ Add'} People</h3>
                                <div className={Styles.profile}>
                                    <img src={formData.img} alt="" />
                                    <label htmlFor="img">choose photo</label>
                                    <input type="file" id='img' onChange={captureImg} name='img'/>
                                </div>
                                <div className={Styles.row}>
                                    <div className={Styles.inputWidth}>
                                        <label>Name</label>
                                        <input type="text" name='name' value={formData.name} onChange={handleChange} required/>
                                    </div>
                                    <div className={Styles.inputWidth}>
                                        <label>Position</label>
                                        <input type="text" name='position' value={formData.position} onChange={handleChange} required/>
                                    </div>
                                </div>
                                <div className={Styles.row}>
                                    <div className={Styles.inputWidth}>
                                        <label>Phone No</label>
                                        <input type="text" name='phoneno' value={formData.phoneno} onChange={handleChange}/>
                                    </div>
                                    <div className={Styles.inputWidth}>
                                        <label>Email</label>
                                        <input type="email" name='email' value={formData.email} onChange={handleChange}/>
                                    </div>
                                </div>
                                <div className={Styles.btns}>
                                    <button onClick={() => setShowForm(false)} className={`btnStructure ${Styles.cancelBtn}`}>cancel</button>
                                    <button type='submit' className={`btnStructure ${Styles.addBtn}`}>
                                        {editingIndex !== null ? '💾 Simpan' : 'Add people'}
                                    </button>
                                </div>
                            </form>
                        )}
                        {!showForm && (
                            <div className={Styles.cardList}>
                                {managementData.map((people, index) => (
                                    <div className={Styles.deleteWrapper} key={index}>
                                        <span className={Styles.actions}>
                                            <i className="fas fa-pen" onClick={() => openEdit(people, index)} style={{ marginRight: 8, cursor: 'pointer', color: '#1069ff' }}></i>
                                            <i className="fas fa-trash" onClick={() => deletePeople(people, index)} style={{ cursor: 'pointer', color: '#dc3545' }}></i>
                                        </span>
                                        <ManagementCard {...people} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Management;
