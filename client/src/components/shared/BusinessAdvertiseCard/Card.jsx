import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './card.css';

const Card = ({ profileImg, familyName, date, discription, advertiseImg, email, phoneNo, dataAos, type = 'nolink', publicUrl = '', margin = 'true' }) => {
    const [lightbox, setLightbox] = useState(null);
    const marginStyle = margin === 'false' ? { margin: '0px' } : { margin: '20px auto' };
    const history = useHistory();

    function pushToProfilePage() {
        if (type === 'link') {
            history.push(`/allmembers/${publicUrl}`);
        }
    }

    return (
        <>
            <div className="box-shadow cardWrapper cardcount" data-aos={dataAos} style={marginStyle}>
                <div className="cardHeader" onClick={pushToProfilePage}>
                    <div id="profile">
                        <img src={profileImg} alt="" />
                    </div>
                    <div className="info">
                        <h3>{familyName}</h3>
                        <p>
                            {date}
                            <span><img src='/images/icons/dot.png' alt="" /></span>
                            <img src="/images/icons/postEarthIcon.png" alt="" />
                        </p>
                    </div>
                </div>
                <div className="discription">
                    <p>{discription}</p>
                </div>
                <div className="contactDetails">
                    <p><i className="fas fa-phone-alt"></i>{phoneNo}</p>
                    <p><i className="fas fa-envelope"></i>{email}</p>
                </div>
                <div className="img">
                    <img src={advertiseImg} alt="" style={{ cursor: 'pointer' }} onClick={() => setLightbox(advertiseImg)} />
                </div>
            </div>

            {lightbox && (
                <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
                    <span className="lightbox-close" onClick={() => setLightbox(null)}>&times;</span>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={lightbox} alt="" className="lightbox-image" />
                    </div>
                </div>
            )}
        </>
    );
};

export default Card;
