import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { text } from '@fortawesome/fontawesome-svg-core';
import { faLocation, faMap, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEye, faClock, faTrash } from '@fortawesome/free-solid-svg-icons';


const BusinessmanHome = () => {


    //const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();
    const ismanLoggedIn = JSON.parse(localStorage.getItem('bloggedin')) || false;
    const [colleges, setColleges] = useState([]);
    const [nearbycolleges, setnearbyColleges] = useState([]);

    const Logout = () => {
        alert('Successfully Logged Out.');

        console.log("hello");
        localStorage.removeItem('bloggedin');
        localStorage.removeItem('buserData');
        navigate('/Busilogin');
        // localStorage.removeItem('my_v');
        setIsLoggedIn(false);
        // history.push('/videos');
    }

    const fetchColleges = () => {
        axios.post('http://localhost:3001/colleges')
            .then(response => {
                //console.log("college here");
                setColleges(response.data);
                //console.log(colleges.programs.course);
            })
            .catch(error => {
                console.error('Error fetching colleges:', error);
            });
    };

    useEffect(() => {
        fetchColleges();

        let buserdata = localStorage.getItem('buserData');
        buserdata = JSON.parse(buserdata);
        console.log("checking buserdata");
        console.log(buserdata);
        console.log(buserdata.pincode);
        const userpin = buserdata.pincode;
        axios.post('http://localhost:3001/nearbycolleges', { userpin })
            .then(response => {
                //console.log("college here");
                setnearbyColleges(response.data);
                console.log("near by colleges are here");
                //console.log(response.data);
                //console.log(nearbycolleges);
            })
            .catch(error => {
                console.error('Error fetching colleges:', error);
            });
    }, []);

    useEffect(() => {
        console.log(nearbycolleges);
    }, [nearbycolleges]);

    return (
        <>
            <div>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container-fluid" style={{ background: 'black', height: '60px' }}>
                        <a style={{
                            fontWeight: 'bold',
                            fontSize: '25px',
                            color: 'transparent',
                            background: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                            WebkitBackgroundClip: 'text', // Enable background clipping for text
                            textDecoration: 'none', // Remove underline
                            marginLeft: '20px',
                        }} class="navbar-brand" href="/">PeerTeach</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <a class="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" href="/BusinessmanHome"><b>Home</b></a>
                                </li>
                                {
                                    ismanLoggedIn && (<>
                                        <li class="nav-item">
                                            <button className="btn_1" style={{ marginTop: '12px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" onClick={Logout}>Logout</button>
                                        </li>
                                    </>)
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
                <h2 style={{ textAlign: 'center' }}>Your Near By Colleges</h2>
                <div className='college_setup'>
                    {nearbycolleges.map((college, index) => (
                        <div className="nav-item" key={index}>
                            <button className="college_btn" style={{ marginTop: '12px', color: 'black', fontSize: '17px', }} aria-current="page">{college.name}   &nbsp; &nbsp;  &nbsp; <FontAwesomeIcon icon={faMapMarker} /></button>

                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BusinessmanHome;

