import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faUsers, faLocation } from '@fortawesome/free-solid-svg-icons';
import { FaVideo, FaUserFriends, FaBullhorn } from 'react-icons/fa';
import Image from 'react-bootstrap/Image';
import welcomeImage from './assets/welcome.png';
import profileImage from './assets/user.png';
import { faCalendar, faCheckCircle, faHandsPraying, faInr, faRupee, faTimeline, faTimes, faUpload, faUser } from '@fortawesome/free-solid-svg-icons';
import Profile_Busi from './Profile_Busi'
import Modal from 'react-bootstrap/Modal';

const BusinessmanHome = () => {
    const navigate = useNavigate();
    const ismanLoggedIn = JSON.parse(localStorage.getItem('bloggedin')) || false;
    const [colleges, setColleges] = useState([]);
    const [nearbycolleges, setnearbyColleges] = useState([]);
    const [bdata, setBdata] = useState();
    const [viewcolleges, setViewColleges] = useState(false);
    const [students, setStudents] = useState([]);
    const [count, setCount] = useState(null);
    const [profile, setProfile] = useState(false);


    const bannerStyle = {
        background: 'linear-gradient(135deg, #ff6ec4, #7873f5)',
        padding: '60px 20px',
        borderRadius: '10px',
        textAlign: 'center',
        color: '#fff',
        width: 'calc(100% - 40px)',
        margin: '10px auto',
        position: 'relative',
        marginTop: '-2px'
    };

    const buttonStyle = {
        backgroundColor: '#fff',
        color: '#7873f5',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
        marginTop: '10px',
    };

    const featureStyle = {

        textAlign: 'center',
        margin: '50px auto',
        padding: '20px',
        maxWidth: '800px',
        // marginTop: viewcolleges ? '10vw' : '0px'
    };

    // const featureStyle = {
    //     color: 'white',
    //     background: 'linear-gradient(135deg, #ff6ec4, #7873f5)',
    //     padding: '50px 20px',
    //     textAlign: 'center',
    //     color: '#fff',
    //     margin: '50px auto',
    //     maxWidth: '800px',
    //     borderRadius: '10px',
    //     boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    //     marginTop: viewcolleges ? '2vw' : '50px',
    //     width: '100%',
    // };

    const iconStyle = {
        fontSize: '50px',
        color: '#ff6ec4',
        marginBottom: '20px',
    };

    const titleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#7873f5',
        marginBottom: '10px',
    };

    const descriptionStyle = {
        fontSize: '18px',
        color: '#333',
        lineHeight: '1.5',
    };

    const Logout = () => {
        alert('Successfully Logged Out.');
        localStorage.removeItem('bloggedin');
        localStorage.removeItem('buserData');
        navigate('/Busilogin');
    }

    const fetchColleges = () => {
        axios.post('http://localhost:3001/colleges')
            .then(response => {
                setColleges(response.data);
            })
            .catch(error => {
                console.error('Error fetching colleges:', error);
            });
    };

    useEffect(() => {
        fetchColleges();
        let buserdata = JSON.parse(localStorage.getItem('buserData'));
        setBdata(buserdata);
        const userpin = buserdata.pincode;
        axios.post('http://localhost:3001/nearbycolleges', { userpin })
            .then(response => {
                setnearbyColleges(response.data);
            })
            .catch(error => {
                console.error('Error fetching nearby colleges:', error);
            });
    }, []);

    const collegeClicked = (collegeId) => {
        localStorage.setItem('selectedCollege', null);
        localStorage.setItem('slclStudents', null);
        console.log("hello in selected college");
        const selectedCollege = colleges.find(college => college._id === collegeId);
        console.log(selectedCollege);
        const studentCount = students.find(student => student.college === selectedCollege.name)?.count;
        localStorage.setItem('selectedCollege', JSON.stringify(selectedCollege));
        localStorage.setItem('slclStudents', JSON.stringify(studentCount));
        navigate('/purchaseform');
    }

    const viewColleges = () => {
        setViewColleges(!viewcolleges);
    }

    useEffect(() => {
        fetchStudents();
    }, [nearbycolleges]);

    const fetchStudents = () => {
        nearbycolleges.forEach(college => {
            axios.post('http://localhost:3001/students', { selclg: college.name })
                .then(response => {
                    setStudents(prevState => [...prevState, { college: college.name, count: response.data.length }]);
                })
                .catch(error => {
                    console.error('Error fetching students:', error);
                });
        });
    };

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
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" href="/BusinessmanHome"><b>Home</b></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" href="/myBills"><b>My Bills</b></a>
                                </li>

                                <li className="nav-item">
                                    <button className="btn_1" style={{ marginTop: '12px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" onClick={Logout}>Logout</button>
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


                <div style={bannerStyle}>
                    <div style={{ marginLeft: '1.5%', color: 'black', margin: '1% 7% 1% 7%', fontSize: '17px', textAlign: 'center' }}>
                        <Image style={{ height: '150px', marginTop: '-7%' }} src={welcomeImage} />
                        <h1 style={{ color: '#0076CE', fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}><FontAwesomeIcon style={{ color: '#1F305E' }} icon={faHandsPraying} /> Welcome to PeerTeach Advertising Platform</h1>
                        <p style={{ marginBottom: '20px', fontSize: '19px' }}>Attract nearby college students by advertising through PeerTeach. Our platform provides targeted advertising solutions tailored to local college campuses, empowering your business to reach and engage with this specific audience. Grow your business with PeerTeach's effective advertising strategies.</p>
                        <p style={{ fontStyle: 'italic', marginBottom: '20px' }}><b>Discover the power of localized advertising and connect with potential customers like never before.</b></p>
                        <button style={buttonStyle} onClick={viewColleges}>Get Colleges!</button>
                    </div>
                </div>

                {viewcolleges && nearbycolleges.map((college, index) => (
                    <div className="nav-item" key={index}>
                        <button className='card_style' onClick={() => collegeClicked(college._id)}>
                            <div className='clg_icon'><FontAwesomeIcon icon={faBuildingColumns} />&nbsp; {college.name}</div>
                            <div className='user_icon' ><FontAwesomeIcon icon={faUsers} /> &nbsp;{students.find(student => student.college === college.name)?.count}</div>
                            <div className='user_icon'><FontAwesomeIcon icon={faLocation} /> &nbsp;{college.address}, {college.pincode}</div>
                        </button>
                    </div>
                ))}

                <div style={{ ...featureStyle, marginTop: viewcolleges ? '2vw' : '50px' }}>
                    {/* <h2 style={{ textAlign: 'center', color: '#7873f5', marginBottom: '30px' }}>Features</h2> */}

                    <div style={{ display: 'flex', marginTop: '5vw', justifyItems: 'flex-start' }}>
                        <div>
                            <FaBullhorn style={iconStyle} />
                            <h2 style={titleStyle}>Boost Brand Awareness</h2>
                            <p style={descriptionStyle}>Increase brand recognition and awareness by promoting your services through student-generated content. Stand out in a crowded market and attract more customers.</p>
                        </div>
                        <div style={{ marginLeft: '2rem' }}>
                            <FaVideo style={iconStyle} />
                            <h2 style={titleStyle}>Advertise in Student Videos</h2>
                            <p style={descriptionStyle}>Reach your target audience by placing ads in videos created by students. Connect with a diverse audience through engaging content.</p>
                        </div>
                        <div style={{ marginRight: '2vw' }}>
                            <FaUserFriends style={iconStyle} />
                            <h2 style={titleStyle}>Expand Your Reach</h2>
                            <p style={descriptionStyle}>Tap into the dynamic student community and increase brand visibility. Connect with potential customers and expand your market reach.</p>
                        </div>

                    </div>
                </div>
                {
                    profile &&
                    <Profile_Busi onClose={profile_show} />

                }

            </div>

        </>
    )
}

export default BusinessmanHome;

