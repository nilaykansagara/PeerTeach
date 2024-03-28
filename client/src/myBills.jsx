import { Axios } from 'axios';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt, FaUser, FaUniversity, FaMoneyBillAlt, FaUserGraduate, FaFileInvoice, FaCrown, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faCalendar, faCheck, faCheckCircle, faCoins, faCrown, faHandsPraying, faInr, faList, faRupee, faSquare, faSquareCheck, faTimeline, faTimes, faUpload, faUser } from '@fortawesome/free-solid-svg-icons';
import Profile_Busi from './Profile_Busi'
import profileImage from './assets/user.png';

function MyBills() {
    const [bills, setbills] = useState([]);
    const [clicked, setClicked] = useState(0);
    const [profile, setProfile] = useState(false);

    useEffect(()=>{
        const buserData = localStorage.getItem("buserData");
        const bdata = JSON.parse(buserData);
        console.log("hiiiiiiiiiii")
        console.log(bdata);
        axios.post('http://localhost:3001/findBills', bdata).
        then((response) => {
            console.log(response.data);
            setbills(response.data.reverse())

        }).catch((error) => {
            console.log("error");
            console.log(error);
        })
    },[clicked])

    const setBills = () => {
        setClicked(!clicked);
    }

    const formDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    const profile_show = (e) => {
        setProfile(!profile);
    }

    return (
        <>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid" style={{ background: 'black', height: '60px' }}>
                        <a style={{
                            fontWeight: 'bold',
                            fontSize: '25px',
                            color: 'transparent',
                            background: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                            WebkitBackgroundClip: 'text', // Enable background clipping for text
                            textDecoration: 'none', // Remove underline
                            marginLeft: '20px',
                        }} className="navbar-brand" href="/">PeerTeach</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', cursor: 'pointer' }} aria-current="page"><b>Home</b></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', cursor: 'pointer' }} aria-current="page" onClick={setBills}  ><b>My Bills</b></a>
                                </li>

                            </ul>
                            <a style={{ backgroundColor: 'linear-gradient(to bottom right, #ff4d4d, #007bff)', }} onClick={profile_show}> {/* Replace '/profile' with the link you want */}
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                                        borderRadius: '50%',
                                        marginLeft: 'auto',
                                        marginRight: '10px',
                                    }}
                                />
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
            <div>
                {
                    bills.length === 0 ? (
                        <p style={{
                            color: 'red',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '25px',
                        }}>No matching found</p>
                    ) : (
                        <ul>
                            {bills.map((bill) => (
                                
                                <Container key={bill._id} className="invoice-container">
                                    <Row className="invoice-header">
                                        <Col>
                                            <h3><FaFileInvoice style={{fontSize:'30px', marginBottom:'7px'}}/> Invoice #{bill._id}</h3>
                                        </Col>
                                    </Row>
                                    <Row className="invoice-details">
                                        <Col xs={6}>
                                            <p><FaUser style={{marginBottom:'5px'}}/> Businessman: {bill.busi_name}</p>
                                            <p><FaCalendarAlt style={{marginBottom:'5px'}}/> Purchase Date: {formDate(bill.purchaseDate)}</p>
                                            <p><FaCalendarAlt style={{marginBottom:'5px'}}/> Allotted Date: {formDate(bill.AllotDate)}</p>
                                            
                                            <p><FaMoneyBillAlt style={{marginBottom:'5px'}}/> Price Paid: {bill.purchasePrice}</p>
                                        </Col>
                                        <Col xs={6}>
                                            <p><FaUniversity style={{marginBottom:'5px'}}/> College Name: {bill.college_name}</p>
                                            <p><FaUserGraduate style={{marginBottom:'5px'}}/> Number of Students: {bill.no_of_users}</p>
                                            <p><FaCrown style={{marginBottom:'5px'}}/> Plan: {bill.plan_type}</p>
                                            <p><FaUsers style={{marginBottom:'5px'}}/> Viewer Cost: {bill.viewer_cost}</p>
                                        </Col>
                                    </Row>
                                </Container>
                            ))}
                        </ul >
                    )
                }
            </div>
            {
                    profile &&
                            <Profile_Busi onClose={profile_show} />
                        
            }


        </>
    )

}

export default MyBills;