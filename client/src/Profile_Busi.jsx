import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './list.css';
import { useNavigate } from "react-router-dom";
import profileImage from './assets/user.png';
import Update from './Update'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Update_Busi from './Update_Busi';
import Modal from 'react-bootstrap/Modal';


const Profile_Busi = ({ onClose,  }) => {
    // const [seevideos, setSeevideos] = useState();
    const [videos, setVideos] = useState([]);
    const [update, setUpdate] = useState();
    let bdata = localStorage.getItem('buserData');
    // const [fetch_videos, Setfetch_videos] = useState(false);
    const busi_data = JSON.parse(bdata);
    const name = busi_data.owner_name;
    const email = busi_data.email;
    console.log(busi_data);
    let my_videos;

    // function seeVideos() {
    //     axios.post('http://localhost:3001/seeVideos', { name, email }).then((response) => {
    //         // my_videos = JSON.stringify(response.data);
    //         setVideos(response.data);
    //         console.log(videos);
    //         // videos = videos[0];
    //         // console.log(videos);
    //     });
    //     setSeevideos(!seevideos);
    // }

    // function closeVideos() {
    //     setSeevideos(!seevideos);
    // }

    const handleChange = (event) => {
        const { name, value } = event.target;
        userData.email = value;
    };

    function SetUpdate() {
        setUpdate(!update);
    }

    function CancelUpdate() {
        setUpdate(!update);
    }

    // const handleDelete = (id) => {
    //     console.log("hello i am manan");
    //     axios.post('http://localhost:3001/deleteVideos', { id, email }).then(
    //         (response) => {
    //             setVideos(response.data);
    //         }
    //     )
    // }
    return (
        <Modal show={1}>
            {/* <Modal.Body> */}
                <div>
                    {update &&
                        <Update_Busi cancelUpdate={CancelUpdate} />
                    }
                    {
                        !update &&
                        <div className="popup-container" style={{ alignItems: 'center' }}>
                            <div className="popup" style={{ hight: '500px', width: '600' }}>
                                <div className='header'>
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            backgroundColor: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                                            borderRadius: '50%',
                                            marginTop: '40px',
                                            marginLeft: '4%',
                                            marginRight: '10px',
                                        }}
                                    />
                                </div>
                                <h3 style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'league spartan' }}><b>{busi_data.owner_name}</b></h3>
                                <hr />
                                <div style={{ marginLeft: '10%', marginTop: '30px', display: 'flex' }}>
                                    <div className='prof_left' style={{ width: 'fit-content' }}>
                                        <p>Email: &nbsp;<b>{busi_data.email}</b></p>
                                        <p>Shop Name: &nbsp;<b>{busi_data.shop_name}</b></p>
                                        <p>Business Description: &nbsp;<b>{busi_data.business_description}</b></p>
                                    </div>
                                    <div className='v1' style={{ borderLeft: '1px solid grey', height: '100px', marginLeft: '20px', marginRight: '20px' }} />
                                    <div className='prof_right'>
                                        <p>Address: &nbsp;<b>{busi_data.address}</b></p>
                                        <p>Phone Number: &nbsp;<b>{busi_data.phone_number}</b></p>
                                        <p>Pincode: &nbsp;<b>{busi_data.pincode}</b></p>
                                    </div>
                                </div>

                                {/* {
                            seevideos &&
                            <div>
                                <div style={{ justifyContent: 'center', display: 'flex', marginTop: '20px' }}>
                                    <button onClick={closeVideos} className='update-button'>Close Videos</button>
                                </div>
                                <ul style={{ justifyContent: 'center', display: 'grid', marginTop: '20px' }}>
                                    {videos.map((video) => (
                                        <div key={video._id} style={{ display: 'inline-flex', marginLeft: '-8%', marginBottom: '13px' }}>
                                            <video controls width="180" height="100" >
                                                <source src={`http://localhost:3001/videos/${video._id}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            <div style={{ marginLeft: '10px' }}>
                                                <p style={{ marginBottom: '2px', fontSize: '15px' }}>{video.title}</p>
                                                <p style={{ marginBottom: '2px', fontSize: '11px' }}>{video.otherDetails}</p>
                                                <p style={{ marginBottom: '2px', fontSize: '11px' }}>
                                                    Subject: {video.subject} | Semester: {video.semester} | Branch: {video.branch} </p>
                                                <p style={{ fontSize: '11px', marginBottom: '0px' }}>Course : {video.course} | College: {video.college} </p>
                                                <p style={{ fontSize: '11px', marginBottom: '0px' }}>Likes : {video.likec} | Dislikes: {video.dislikec}
                                                    &nbsp;
                                                    &nbsp;
                                                    &nbsp;

                                                    <span><a
                                                        href={video.notes}
                                                        style={{
                                                            border: 'solid 2px',
                                                            borderColor: '#72D072',
                                                            color: 'white',
                                                            backgroundColor: '#72D072',
                                                            padding: '1px',
                                                            borderRadius: '3px',
                                                            marginTop: '0px',
                                                            height: '20px', width: '50px', fontSize: '11px',
                                                            textDecoration: 'none', // Remove underline for the link
                                                        }}
                                                        target="_blank" // Open the link in a new tab/window
                                                        rel="noopener noreferrer"

                                                    >
                                                        Get Notes!
                                                    </a></span>
                                                    &nbsp;
                                                    &nbsp;
                                                    <button style={{ marginTop: '0px', height: '20px', width: '50px', fontSize: '11px' }} onClick={() => handleDelete(video._id)} className='delete-button'>Delete</button>
                                                </p>
                                            </div>

                                        </div>
                                    ))

                                    }

                                </ul >

                            </div>
                        } */}

                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                                    {/* {
                                !seevideos &&
                                // <div style={{ justifyContent: 'center', display: 'flex', marginTop: '25px' }}>
                                <button onClick={seeVideos} className='myvideos-button'>My Videos</button>
                                // </div>
                            } */}
                                    <button className="update-button" onClick={setUpdate}>
                                        Update
                                    </button>
                                    <button className="close-button" onClick={onClose}>
                                        Close
                                    </button>
                                </div>

                            </div>
                        </div>
                    }
                </div>
            {/* </Modal.Body> */}
        </Modal>
    );
};

export default Profile_Busi;