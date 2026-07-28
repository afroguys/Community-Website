import { useEffect, useState } from "react";
import { getHomePageData } from "../../http";
import { Loader } from '../../import';
import Styles from "./AllMembers.module.css";

const AllMembers = () => {
    const [management, setManagement] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Pengurusan - Taman';
        async function load() {
            try {
                const { data } = await getHomePageData();
                if (data) setManagement(data.management || []);
            } catch (e) { }
            setLoading(false);
        }
        load();
    }, []);

    return loading ? <Loader message='loading please wait ...' /> : (
        <div className={`container container-margin-top ${Styles.wrapper}`}>
            <h2 className="heading">🏢 Pengurusan Taman</h2>
            <div className={Styles.cardList}>
                {management.length === 0 && <p style={{ textAlign: 'center' }}>Tiada data organisasi lagi.</p>}
                {management.map((person, i) => (
                    <div key={i} className={`box-shadow ${Styles.card}`}>
                        <div className={Styles.imgWrap}>
                            <img src={person.img} alt={person.name} />
                        </div>
                        <h3>{person.name}</h3>
                        <p className={Styles.role}>{person.position || 'Ahli'}</p>
                        {person.discription && <p className={Styles.desc}>{person.discription}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllMembers;
