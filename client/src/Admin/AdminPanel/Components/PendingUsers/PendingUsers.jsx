import { useState, useEffect } from 'react';
import { getPendingUsers, approveUser, rejectUser } from '../../../../http';
import Styles from './PendingUsers.module.css';

const PendingUsers = () => {
    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => { load(); }, []);

    async function load() {
        const { data } = await getPendingUsers();
        setUsers(data.users || []);
    }

    async function approve(userId) {
        await approveUser({ userId });
        setMsg('User approved!');
        load();
    }

    async function reject(userId) {
        await rejectUser({ userId });
        setMsg('User rejected and removed.');
        load();
    }

    return (
        <div className={Styles.wrapper}>
            <h2>⏳ Pending Approval</h2>
            {msg && <p style={{ color: 'green' }}>{msg}</p>}
            {users.length === 0 ? <p>No pending users.</p> : (
                <table className={Styles.table}>
                    <thead><tr><th>Name</th><th>Email</th><th>House</th><th>Phone</th><th>Action</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>{u.familyName || '-'}</td><td>{u.email}</td><td>{u.houseNo}</td><td>{u.phoneNo || '-'}</td>
                                <td><button className={Styles.approve} onClick={() => approve(u._id)}>✅ Approve</button>
                                    <button className={Styles.reject} onClick={() => reject(u._id)}>❌ Reject</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default PendingUsers;
