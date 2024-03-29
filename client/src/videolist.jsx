import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './list.css';
import { useNavigate } from "react-router-dom";
import profileImage from './assets/user.png';
import Profile from "./Profile";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faEye, faClock, faTrash, faMailBulk } from '@fortawesome/free-solid-svg-icons';

const temp = localStorage.getItem('loggedin');

const VideoList = () => {
    // const history = useHistory();
    const isUserLoggedIn = JSON.parse(localStorage.getItem('loggedin')) || false;
    const [change_view, setChange_view] = useState(0);
    const [userinfo, setinfo] = useState('');
    const [likes, setLikes] = useState('');
    const [dislikes, setDisLikes] = useState('');
    const [watchlaterflag, setwlf] = useState('');
    const [videos, setVideos] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(false);
    const [runvid, setrunvid] = useState(null);
    const [searchData, setsearchData] = useState({
        title: '',
        college: '',
        course: '',
        branch: '',
        semester: '',
        subject: '',
        name: '',
        email: '',
        batch: '',
    });






    // useEffect(() => {
    //     // Retrieve the data from storage (or wherever you stored it)
    const handleLike = (videoId, email) => {
        // Make an API request to update the liked array in the backend
        axios.post(`http://localhost:3001/like/${videoId}/${email}`)
            .then((response) => {
                const isLiked = response.data.video.liked.includes(email);
                const isDisliked = response.data.video.disliked.includes(email);
                setLikes(isLiked);
                setDisLikes(isDisliked);
                // Update the UI with the new like count
                setVideos((prevVideos) => {
                    const updatedVideos = prevVideos.map((video) => {
                        if (video._id === videoId) {
                            video.likec = response.data.video.liked.length;
                            video.dislikec = response.data.video.disliked.length;
                            console.log("in like imm");
                            console.log(email);
                            console.log(video);
                        }
                        return video;
                    });
                    return updatedVideos;
                });
            })
            .catch((error) => {
                console.error('Error liking video', error);
            });
    };

    const watchLater = (videoId, email) => {
        axios.post(`http://localhost:3001/watchLater/${videoId}/${email}`)
            .then((response) => {
                console.log("added errorchecking");
                console.log(response.status);
                if (response.status === 200) {
                    alert('Video added to watch later list successfully');
                }
            })
            .catch((error) => {
                console.log("here in added error");
                alert('Video is already in watch later list');
                console.error('Error adding video to watch later list', error);
            });
    };


    const handleDislike = (videoId, email) => {
        // Make an API request to update the disliked array in the backend
        axios.post(`http://localhost:3001/dislike/${videoId}/${email}`)
            .then((response) => {
                const isLiked = response.data.video.liked.includes(email);
                const isDisliked = response.data.video.disliked.includes(email);
                setLikes(isLiked);
                setDisLikes(isDisliked);
                // Save the values in local storage

                // Update the UI with the new dislike count
                setVideos((prevVideos) => {
                    const updatedVideos = prevVideos.map((video) => {
                        if (video._id === videoId) {
                            video.likec = response.data.video.liked.length;
                            video.dislikec = response.data.video.disliked.length;
                            console.log("in dislike imm");
                            console.log(email);
                            console.log(video);
                        }
                        return video;
                    });
                    return updatedVideos;
                });
            })
            .catch((error) => {
                console.error('Error disliking video', error);
            });
    };

    const handleSubmit = (e) => {
        navigate('/VideoUpload')
    }
    const handleChange = (event) => {
        const { name, value } = event.target;
        setsearchData({ ...searchData, [name]: value });
    };




    const logged = (e) => {
        navigate('/Signin');

    }
    const handleSubmit_Without_signin = (e) => {
        navigate('/Signin');
    }

    const handleSubmit2 = (event) => {
        event.preventDefault();

        console.log("Hello from filte 2");
        const searchDataToSend = {
            title: searchData.title,
            college: searchData.college,
            course: searchData.course,
            branch: searchData.branch,
            semester: searchData.semester,
            subject: searchData.subject,
            name: searchData.name,
            email: searchData.email,
            batch: searchData.batch
        };
        console.log("Hello from filter");
        console.log(searchDataToSend);
        axios.post('http://localhost:3001/VideoFilter', searchDataToSend)
            .then((response) => {
                console.log("in Post");
                setVideos(response.data); // Update the videos state with filtered results
            })
            .catch((error) => {
                console.error('Error filtering videos', error);
            });
    };

    const profile_show = (e) => {
        setProfile(!profile);
    }

    const Logout = () => {
        alert('Successfully Logged Out.');
        console.log("hello");
        localStorage.removeItem('loggedin');
        localStorage.removeItem('userData');
        localStorage.removeItem('my_videos');
        setIsLoggedIn(false);
        // history.push('/videos');
    }

    const likedlist = () => {
        setwlf(null);
        console.log("hello from likedlist");
        axios.post(`http://localhost:3001/likefind/${userinfo.email}`)
            .then((response) => {
                console.log("hello from likedlist new");
                setVideos(response.data);
            })
            .catch((error) => {
                console.error('Error liking video', error);
            });
    };

    const dislikedlist = () => {
        setwlf(null);
        // Filter videos that are liked by the current logged-in user
        axios.post(`http://localhost:3001/dislikefind/${userinfo.email}`)
            .then((response) => {
                console.log("hello from dislikedlist");
                setVideos(response.data);
            })
            .catch((error) => {
                console.error('Error liking video', error);
            });
    };

    const history = () => {
        setwlf(null);
        console.log("hello from history");
        axios.post(`http://localhost:3001/historyfind/${userinfo.email}`)
            .then((response) => {
                console.log("hello from history list new");
                setVideos(response.data);
            })
            .catch((error) => {
                console.error('Error liking video', error);
            });
    };

    const watchlater = () => {
        console.log("hello from watch later list");
        setwlf(1);
        axios.post(`http://localhost:3001/watchlaterfind/${userinfo.email}`)
            .then((response) => {
                console.log("hello from watch later list new");
                setVideos(response.data);
            })
            .catch((error) => {
                console.error('Error liking video', error);
            });
    };

    const removewatchLater = (videoId, email) => {
        axios.post(`http://localhost:3001/removewatchLater/${videoId}/${email}`)
            .then((response) => {
                console.log("remove checking");
                setwlf(1);
                setVideos(response.data);
            })
            .catch((error) => {
                console.log('here in error');
                console.error('Error in remove', error);
            });
    };
    const [adStates, setAdStates] = useState({}); // State to track ad display status for each video
    const [showAd, setShowAd] = useState(true);

    // Function to handle ad end for a specific video
    const handleAdEndForVideo = (videoId) => {
        // Update the state to mark the ad as shown for this video
        setAdStates((prevAdStates) => ({
            ...prevAdStates,
            [videoId]: true,
        }));
    };

    useEffect(() => {
        setwlf(null);
        let utemp = localStorage.getItem('userData');
        const userinfo = JSON.parse(utemp);
        setinfo(userinfo);
        // Fetch the list of videos when the component mounts
        axios.get('http://localhost:3001/videos')
            .then((response) => {
                setVideos(response.data);
            })
            .catch((error) => {
                console.error('Error fetching videos:', error);
            });
    }, [change_view]);

    // useEffect(() => {
    //     if (video.ad.ad_path) {
    //         fetch(`http://localhost:3001/videos/${video._id}/ad`)
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch ad');
    //                 }
    //                 return response;
    //             })
    //             .then(() => {
    //                 // Start playing the main video after 4 seconds
    //                 setTimeout(() => {
    //                     videoRef.current.play();
    //                 }, 4000);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching ad:', error);
    //                 // Start playing the main video immediately
    //                 videoRef.current.play();
    //             });
    //     } else {
    //         // If no ad, play the main video immediately
    //         videoRef.current.play();
    //     }
    // }, [video.ad.ad_path, video._id]);

    const recordView = async (video) => {
        if (videos.find(videovar => videovar._id === video._id)?.ad && !adStates[video._id]) {
            // Show the ad first
            setShowAd(true);
            // Set a timeout to hide the ad and start the main video after the ad ends
            setTimeout(() => {
                setShowAd(false);
                handleAdEndForVideo(video._id);
                setrunvid(video._id); // Set the current video to play
            }, 4000); // Adjust this timeout as needed
        } else {
            // If there's no ad or the ad has already been shown for this video, start the main video
            setrunvid(video._id);
        }
        let email;
        if (isLoggedIn) {
            let utemp = localStorage.getItem('userData');
            const userinfo = JSON.parse(utemp);
            email = userinfo.email;
        }
        else {
            email = null;
        }
        let arg = video._id;
        console.log(arg);
        let fingerprint = localStorage.getItem('fingerprint');
        console.log(fingerprint);
        axios.post('http://localhost:3001/countViews', { email, fingerprint, arg })
            .then((response) => {
                console.log("View is updated successfully.");
                setChange_view((c) => !c)
            })




    }

    return (
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
                                <a class="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" href="/videos"><b>Home</b></a>
                            </li>
                            {
                                isLoggedIn && (<>
                                    <li class="nav-item">
                                        <button className="btn_1" style={{ marginTop: '12px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" onClick={likedlist}>Liked Videos</button>
                                    </li>
                                    <li class="nav-item">
                                        <button className="btn_1" style={{ marginTop: '12px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" onClick={dislikedlist}>Disliked Videos</button>
                                    </li>
                                    <li class="nav-item">
                                        <button className="btn_1" style={{ marginTop: '12px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" onClick={history}>History</button>
                                    </li>
                                    <li class="nav-item">
                                        <button className="btn_1" style={{ marginTop: '12px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" onClick={watchlater}>Watch later</button>
                                    </li>
                                    <li class="nav-item">
                                        <button className="btn_1" style={{ marginTop: '12px', color: '#C8C8C8', fontSize: '17px', }} aria-current="page" onClick={Logout}>Logout</button>
                                    </li>
                                </>)

                            }
                        </ul>
                        {isLoggedIn &&
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
                        }
                        {
                            !isLoggedIn &&
                            <button className='btn_1' onClick={logged}>Sign in</button>
                        }
                    </div>
                </div>
            </nav>

            <div class="splitl left">
                <h3 style={{ textAlign: 'center', marginTop: '-4%' }}>
                    <b>Filter</b></h3>
                <div style={{ marginLeft: '15px', marginRight: '5%' }}>
                    <form onSubmit={handleSubmit2}>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            onChange={handleChange}
                            value={searchData.title}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter Title" />
                        <input
                            type="text"
                            id="college"
                            name="college"
                            onChange={handleChange}
                            value={searchData.college}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter College name" />
                        <input
                            type="text"
                            id="course"
                            name="course"
                            onChange={handleChange}
                            value={searchData.course}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter Course" />
                        <input
                            type="text"
                            id="branch"
                            name="branch"
                            onChange={handleChange}
                            value={searchData.branch}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter Branch" />
                        <input
                            type="number"
                            id="semester"
                            name="semester"
                            onChange={handleChange}
                            value={searchData.semester}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter Semester" />
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            onChange={handleChange}
                            value={searchData.subject}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter Subject" />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleChange}
                            value={searchData.name}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter name of Uploader" />
                        <input
                            type="text"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            value={searchData.email}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter email of Uploader" />
                        <input
                            type="number"
                            min="1990"
                            max="2099"
                            id="batch"
                            name="batch"
                            onChange={handleChange}
                            value={searchData.batch}
                            style={{ marginBottom: '7px' }} class="form-control" placeholder="Enter Batch of Uploader" />
                        <button style={{ marginTop: '8%' }} type="submit" class="btn btn-primary filterbtn">Search</button>
                    </form>
                </div>
            </div>
            <div class="splitr right" style={{
                height: '490px', // Adjust the height as needed
                overflow: 'auto', // Enable scrolling
            }}>

                {
                    videos.length === 0 ? (
                        <p style={{
                            color: 'red',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '25px',
                        }}>No matching found</p>
                    ) : (
                        <ul>
                            {videos.map((video) => (

                                <div key={video._id} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '0.2%', marginBottom: '8px' }}>
                                    {console.log(video.views_cnt)}
                                    <div >
                                        {/* Show the ad video if ad is available and showAd is true */}
                                        {video.ad && showAd && (
                                            <video onEnded={() => handleAdEndForVideo(video._id)} width="290" height="180" controls>
                                                <source src={`http://localhost:3001/adAppend/${video._id}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}

                                        {/* Show the main video if ad has ended or there's no ad */}
                                        {(!video.ad || !showAd || adStates[video._id]) && (
                                            <video autoPlay={video._id === runvid} onPlay={() => recordView(video)} width="290" height="180" controls>
                                                <source src={`http://localhost:3001/videos/${video._id}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                    <div style={{ marginLeft: '10px' }}>
                                        <p style={{ marginBottom: '-5px', fontSize: '25px' }}><b>{video.title}</b></p>
                                        <p style={{ marginBottom: '1px', fontSize: '15px' }}>{video.otherDetails}</p>
                                        <p style={{ marginBottom: '1px', fontSize: '15px' }}>
                                            Subject: <b>{video.subject}</b> | Semester: <b>{video.semester}</b> | Branch: <b>{video.branch}</b> | Course : <b>{video.course}</b> | College: <b>{video.college}</b> | Batch of Uploader : <b>{video.batch}</b></p>
                                        <p style={{ marginBottom: '0%', fomarginBottom: '2px', fontSize: '15px' }}>Uploaded by: <b>{video.name}</b><br />Email id: <b>{video.email}</b></p>
                                        {!isLoggedIn && (<><p><FontAwesomeIcon icon={faEye} /> <b> {video.views_cnt} </b> &nbsp; &nbsp; &nbsp; &nbsp;<span>
                                            {video.notes && video.notes.length > 0 && (
                                                <a
                                                    href={video.notes}
                                                    style={{
                                                        border: 'solid 2px',
                                                        borderColor: '#72D072',
                                                        color: 'white',
                                                        backgroundColor: '#72D072',
                                                        padding: '2px',
                                                        borderRadius: '3px',
                                                        height: '30px',
                                                        width: '50px',
                                                        fontSize: '14px',
                                                        textDecoration: 'none', // Remove underline for the link
                                                    }}
                                                    target="_blank" // Open the link in a new tab/window
                                                    rel="noopener noreferrer"

                                                >
                                                    Get Notes!
                                                </a>
                                            )}
                                        </span></p></>)}

                                        {isLoggedIn && (<>

                                            <FontAwesomeIcon icon={faEye} />
                                            &nbsp;
                                            <b>{video.views_cnt}</b>
                                            &nbsp;
                                            &nbsp;
                                            &nbsp;
                                            <button style={{ backgroundColor: '#99CCFF', border: 'solid 2px', borderColor: 'black', borderRadius: '50%' }} onClick={() => handleLike(video._id, userinfo.email)}>
                                                <FontAwesomeIcon icon={faThumbsUp} />
                                            </button>
                                            &nbsp;
                                            <span>{video.likec}</span>
                                            &nbsp;
                                            &nbsp;
                                            &nbsp;
                                            <button style={{ backgroundColor: '#FF8080', border: 'solid 2px', borderColor: 'black', borderRadius: '50%' }} onClick={() => handleDislike(video._id, userinfo.email)}>
                                                <FontAwesomeIcon icon={faThumbsDown} flip="horizontal" />
                                            </button>
                                            &nbsp;
                                            <span>{video.dislikec}</span>
                                            {!watchlaterflag && (
                                                <>
                                                    &nbsp;
                                                    &nbsp;
                                                    &nbsp;

                                                    <button style={{ backgroundColor: '#FFD700', border: 'solid 2px', borderColor: 'black', borderRadius: '10px' }} onClick={() => watchLater(video._id, userinfo.email)}>
                                                        <FontAwesomeIcon icon={faClock} /> Watch Later
                                                    </button>
                                                </>
                                            )}

                                            &nbsp;
                                            &nbsp;
                                            &nbsp;
                                            <span>
                                                {video.notes && video.notes.length > 0 && (
                                                    <a
                                                        href={video.notes}
                                                        style={{
                                                            border: 'solid 2px',
                                                            borderColor: '#72D072',
                                                            color: 'white',
                                                            backgroundColor: '#72D072',
                                                            padding: '2px',
                                                            borderRadius: '3px',
                                                            marginTop: '0px',
                                                            height: '30px',
                                                            width: '50px',
                                                            fontSize: '14px',
                                                            textDecoration: 'none', // Remove underline for the link
                                                        }}
                                                        target="_blank" // Open the link in a new tab/window
                                                        rel="noopener noreferrer"

                                                    >
                                                        Get Notes!
                                                    </a>
                                                )}
                                            </span>
                                        </>)}


                                        &nbsp;
                                        &nbsp;

                                        {watchlaterflag && (
                                            <button style={{ backgroundColor: '#FF3131', border: 'solid 2px', borderColor: 'black', borderRadius: '15px' }} onClick={() => removewatchLater(video._id, userinfo.email)}>
                                                <FontAwesomeIcon icon={faTrash} /> Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                            }
                        </ul >
                    )
                }
                {
                    profile &&
                    <Profile onClose={profile_show} />
                }

            </div>
            <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '25px',
                    zIndex: 9999,
                }}
            >
                {isLoggedIn &&
                    <button
                        onClick={handleSubmit}
                        type="button"
                        style={{
                            background: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '15%',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '24px',
                        }}
                    >
                        +
                    </button>
                }
                {
                    !isLoggedIn &&
                    <button
                        onClick={handleSubmit_Without_signin}
                        type="button"
                        style={{
                            background: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '15%',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '24px',
                        }}
                    >
                        +
                    </button>
                }
            </div>

        </div >
    );
};

export default VideoList;
