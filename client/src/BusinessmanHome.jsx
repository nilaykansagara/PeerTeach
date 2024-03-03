import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faUsers, faLocation } from '@fortawesome/free-solid-svg-icons';

const BusinessmanHome = () => {
    const navigate = useNavigate();
    const ismanLoggedIn = JSON.parse(localStorage.getItem('bloggedin')) || false;
    const [colleges, setColleges] = useState([]);
    const [nearbycolleges, setnearbyColleges] = useState([]);
    const [bdata, setBdata] = useState();
    const [viewcolleges, setViewColleges] = useState(false);
    const [students, setStudents] = useState([]);
    const [count, setCount] = useState(null);

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
                                {
                                    ismanLoggedIn && (
                                        <li className="nav-item">
                                            <button className="btn_1" style={{ marginTop: '12px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" onClick={Logout}>Logout</button>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className='busistyle'>
                    <div className='college_setup'>
                        <div className='busitext'>
                            <h4 style={{ marginLeft: '15px', marginTop: '10px' }}>Welcome,</h4>
                            <p style={{ marginLeft: '30px', marginTop: '10px' }}>- You can sponsor any video of students of our site and can advertise your service. </p>
                            <p style={{ marginLeft: '30px', marginTop: '10px' }}>Pricing scheme:
                                <li>Regular day: 1000rs for covering college that has a range of 100 to 200 students registered</li>
                                <li>Exam time: 2000rs for covering college that has 100 to 200 students registered.</li>
                            </p>
                            <button style={{ marginLeft: '30px', marginTop: '5px', backgroundColor: 'lightgreen', padding: '8px', borderRadius: '15px' }} onClick={viewColleges}>View colleges</button>
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default BusinessmanHome;

