import { useState, useEffect } from 'react';
import { getRules, addRule, updateRule, deleteRule } from '../../../../http';
import Styles from './RulesManager.module.css';

const RulesManager = () => {
    const [rules, setRules] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [editId, setEditId] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const { data } = await getRules();
        setRules(data.rules || []);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (desc.length > 200) { setMsg('Description max 200 characters'); return; }
        if (!editId && rules.length >= 10) { setMsg('Maximum 10 rules allowed'); return; }

        if (editId) {
            await updateRule({ id: editId, title, description: desc });
        } else {
            const { data } = await addRule({ title, description: desc });
            if (!data.done) { setMsg(data.message || 'Failed'); return; }
        }
        setTitle(''); setDesc(''); setEditId(null); setMsg('');
        load();
    }

    function edit(rule) {
        setTitle(rule.title); setDesc(rule.description); setEditId(rule._id);
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this rule?')) return;
        await deleteRule({ id });
        load();
    }

    const charsLeft = 200 - desc.length;

    return (
        <div className={Styles.wrapper}>
            <h2>📋 Peraturan Taman</h2>
            {msg && <p style={{ color: 'red' }}>{msg}</p>}
            <form onSubmit={handleSubmit} className={Styles.form}>
                <input type="text" placeholder="Rule title" value={title} onChange={e => setTitle(e.target.value)} required maxLength={50} />
                <textarea placeholder="Description (max 200 chars)" value={desc} onChange={e => setDesc(e.target.value)} required maxLength={200} />
                <small style={{ color: charsLeft < 20 ? 'red' : '#666' }}>{charsLeft} characters left</small>
                <button type="submit">{editId ? '✏️ Update' : '➕ Add Rule'} ({rules.length}/10)</button>
                {editId && <button type="button" onClick={() => { setTitle(''); setDesc(''); setEditId(null); }}>Cancel</button>}
            </form>
            <div className={Styles.list}>
                {rules.map(r => (
                    <div key={r._id} className={Styles.card}>
                        <h4>{r.title}</h4>
                        <p>{r.description}</p>
                        <button onClick={() => edit(r)} className={Styles.edit}>✏️</button>
                        <button onClick={() => handleDelete(r._id)} className={Styles.del}>🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default RulesManager;
