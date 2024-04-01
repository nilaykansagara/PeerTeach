import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect, useRef } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import Image from 'react-bootstrap/Image';
import welcomeImage from './assets/welcome.png';
import profileImage from './assets/user.png';
import Profile_Busi from './Profile_Busi';
import { Form, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { faBullhorn, faCalendar, faCheck, faCheckCircle, faCoins, faCrown, faHandsPraying, faInr, faList, faRupee, faSquare, faSquareCheck, faTimeline, faTimes, faUpload, faUser, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faRectangleList } from '@fortawesome/free-solid-svg-icons';
// import Razorpay from 'razorpay'



function Purchaseform() {
    // <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    let ctemp = localStorage.getItem('selectedCollege');
    let sctemp = localStorage.getItem('slclStudents');
    const selectedCollege = JSON.parse(ctemp);
    const slclStudents = JSON.parse(sctemp);
    const [flag, setFlag] = useState(0);
    let [allotDate, setallotDate] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isOpen2, setIsOpen2] = useState(false);
    const [proceedClick, setproceedClick] = useState(0);
    const [costslot1, setcostslot1] = useState(null);
    const [costslot2, setcostslot2] = useState(null);
    const [costslot3, setcostslot3] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [vc, setvc] = useState(0);
    const [selectedCost, setSelectedCost] = useState(null);
    const [profile, setProfile] = useState(false);
    // const navigate = useNavigate();

    const [formData, setFormData] = useState({
        slots: '',
        secs: 4,
        ad: '',
        purchase_date: '',
        busi_name: '',
        busi_email: '',
        college_name: '',
        college_users: '',
        bill_amount: 0
    });


    const [filename, setFilename] = useState('');
    const fileInputRef = useRef(null);


    const btnRef = React.useRef();
    const navigate = useNavigate();
    const homeClicked = () => {
        navigate('/BusinessmanHome');
    }

    const handleSlide = (index) => {
        setCurrentSlideIndex(index);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "secs") {
            // Convert value to number before setting in state
            setFormData({ ...formData, [name]: parseInt(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }


    const handleFileChange = () => {
        const file = fileInputRef.current.files[0];
        if (file) {
            console.log("File selected:", file);
            setFormData(prevFormData => ({ ...prevFormData, ad: file }));
            setFilename(file.name);
        } else {
            console.log("No file selected.");
        }
    };


    // useEffect(() => {
    //     // Create script element
    //     const script = document.createElement('script');
    //     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    //     script.async = true;

    //     // Append the script to the document head
    //     document.head.appendChild(script);

    //     // Clean up function to remove the script when the component unmounts

    //   }, []);



    const proceedClicked = (e) => {
        // e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('slots', plan);
        formDataToSend.append('secs', formData.secs);
        formDataToSend.append('ad', formData.ad);
        formDataToSend.append('purchase_date', formData.purchase_date);
        formDataToSend.append('busi_name', formData.busi_name);
        formDataToSend.append('busi_email', formData.busi_email);
        formDataToSend.append('college_name', formData.college_name);
        formDataToSend.append('college_users', formData.college_users);
        formDataToSend.append('bill_amount', selectedCost);

        if (plan == 1) {
            formDataToSend.append('plan', "Basic");
        }
        else if (plan == 2) {
            formDataToSend.append('plan', "Pro");
        }
        else if (plan == 3) {
            formDataToSend.append('plan', "Premium");
        }

        formDataToSend.append('viewer_cost', vc);
        let total_cost = selectedCost + vc;
        let name = formData.busi_name;
        let email = formData.busi_email;
        //     var options = {
        //         "key": "rzp_test_LCVuFgn411CE6D", // Enter the Key ID generated from the Dashboard
        //         "amount": { total_cost }, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        //         "currency": "INR",
        //         "name": "PeerTeach", //your business name
        //         "description": "Test Transaction",
        //         // "image": "https://example.com/your_logo",
        //         "order_id": {}, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        //         "handler": function (response) {
        //             alert(response.razorpay_payment_id);
        //             alert(response.razorpay_order_id);
        //             alert(response.razorpay_signature)
        //             axios.post('http://localhost:3001/addBill', formDataToSend)
        //                 .then((response) => {
        //                     console.log(response.data);
        //                     setproceedClick(1);
        //                     setallotDate(response.data);
        //                     setShow(false);
        //                     setShow2(true);
        //                 })
        //                 .catch((error) => {
        //                     console.log("Error:", error);
        //                     alert('Error creating invoice. Please try again.');
        //                 });
        //         },
        //         "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        //             "name": {name}, //your customer's name
        //             "email": {email},
        //             // "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
        //         },
        //         "notes": {
        //             "address": "Razorpay Corporate Office"
        //         },
        //         "theme": {
        //             "color": "#3399cc"
        //         }
        //     };
        //     // var rzp1 = new Razorpay(options);
        //     // rzp1.on('payment.failed', function (response) {
        //     //     alert(response.error.code);
        //     //     alert(response.error.description);
        //     //     alert(response.error.source);
        //     //     alert(response.error.step);
        //     //     alert(response.error.reason);
        //     //     alert(response.error.metadata.order_id);
        //     //     alert(response.error.metadata.payment_id);
        //     // });

        //     // rzp1.open();
        //     // e.preventDefault();
        axios.post('http://localhost:3001/addBill', formDataToSend)
            .then((response) => {
                console.log(response.data);
                setproceedClick(1);
                setallotDate(response.data);
                setShow(false);
                setShow2(true);
            })
            .catch((error) => {
                console.log("Error:", error);
                alert('Error creating invoice. Please try again.');
            });

    };



    useEffect(() => {
        if (slclStudents <= 5000) {
            setvc(0);
        }
        else if (slclStudents > 5000 && slclStudents <= 10000) {
            let t = slclStudents * 0.10;
            setvc();
        }
        else if (slclStudents > 10000 && slclStudents <= 20000) {
            let t = slclStudents * 0.20
            setvc(t);
        }
        else if (slclStudents > 20000 && slclStudents < 40000) {
            let t = slclStudents * 0.30
            setvc(t);
        }
        if (currentSlideIndex === 3) {
            console.log("slide index in " + currentSlideIndex);
            console.log("hello from add bill");
            const buserData = localStorage.getItem("buserData");
            const bdata = JSON.parse(buserData);
            const today = new Date();

            // Prepare updated form data for slot 1
            const updatedFormData1 = {
                ...formData,
                busi_email: bdata.email,
                busi_name: bdata.owner_name,
                college_name: selectedCollege.name,
                college_users: slclStudents,
                purchase_date: today,
                slots: 1
            };

            // Update state with updated form data for slot 1
            setFormData(updatedFormData1);
        }
    }, [currentSlideIndex]);

    // Effect for slot 1
    useEffect(() => {
        // Check if formData has been updated for slot 1
        if (formData.slots === 1 && formData.purchase_date) {
            axios.post('http://localhost:3001/createBill', { formData })
                .then((response) => {
                    console.log(response);
                    // Update costslot1 based on response
                    setcostslot1(response.data);
                    // Proceed to update formData for slot 2
                    const updatedFormData2 = {
                        ...formData,
                        slots: 2
                    };
                    setFormData(updatedFormData2);
                })
                .catch((error) => {
                    console.log("Error:", error);
                    alert('Error creating invoice. Please try again.');
                });
        }
    }, [formData.slots, formData.purchase_date]);

    // Effect for slot 2
    useEffect(() => {
        // Check if formData has been updated for slot 2
        if (formData.slots === 2 && formData.purchase_date) {
            axios.post('http://localhost:3001/createBill', { formData })
                .then((response) => {
                    console.log(response);
                    // Update costslot2 based on response
                    setcostslot2(response.data);
                    // Proceed to update formData for slot 3
                    const updatedFormData3 = {
                        ...formData,
                        slots: 3
                    };
                    setFormData(updatedFormData3);
                })
                .catch((error) => {
                    console.log("Error:", error);
                    alert('Error creating invoice. Please try again.');
                });
        }
    }, [formData.slots, formData.purchase_date]);

    // Effect for slot 3
    useEffect(() => {
        // Check if formData has been updated for slot 3
        if (formData.slots === 3 && formData.purchase_date) {
            axios.post('http://localhost:3001/createBill', { formData })
                .then((response) => {
                    console.log(response);
                    // Update costslot3 based on response
                    setcostslot3(response.data);
                })
                .catch((error) => {
                    console.log("Error:", error);
                    alert('Error creating invoice. Please try again.');
                });
        }
    }, [formData.slots, formData.purchase_date]);



    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [plan, setPlan] = useState(null);

    const handleClose = () => setShow(false);
    const handleClose2 = () => setShow2(false);
    const handleShowpr = () => {
        setShow(true);
        setPlan(2);
        setSelectedCost(costslot2)
    }
    const handleShowpm = () => {
        setShow(true);
        setPlan(3);
        setSelectedCost(costslot3)
    }
    const handleShowbs = () => {
        setShow(true);
        setPlan(1);
        setSelectedCost(costslot1)
    }


    const showBills = () => {
        navigate('/mybills');
    }

    const Logout = () => {
        alert('Successfully Logged Out.');
        localStorage.removeItem('bloggedin');
        localStorage.removeItem('buserData');
        navigate('/Busilogin');
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
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', cursor: 'pointer' }} aria-current="page" onClick={homeClicked}><b>Home</b></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', cursor: 'pointer' }} aria-current="page" onClick={showBills}><b>My Bills</b></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', cursor: 'pointer' }} aria-current="page" onClick={Logout}><b>Logout</b></a>
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





            <Carousel style={{ display: 'flex', backgroundColor: '#c9c0bb ', height: '475px', width: '97.50%', marginLeft: '1.3%' }}
                prevIcon={<span className="carousel-control-prev-icon" />}
                nextIcon={<span className="carousel-control-next-icon" />}
                interval={null}
                onSlide={handleSlide}
            >
                <Carousel.Item>
                    <div style={{ marginLeft: '1.5%', color: 'black', margin: '1% 7% 1% 7%', fontSize: '17px', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '40px' }}><FontAwesomeIcon style={{ color: '#E32636' }} icon={faBullhorn} /> <b style={{ color: '#00008B' }}>Attract Students from {selectedCollege.name}</b></h2>
                        <p style={{ fontSize: '20px' }}>
                            You have chosen <b>{selectedCollege.name}</b> for your advertisement, a college with a total of <b>{slclStudents}</b> registered students on PeerTeach. By selecting this college, your ad will be visible to students in your pincode area, offering you extensive visibility and potential customer engagement.
                        </p>
                        <p style={{ fontSize: '18px' }}>
                            Explore our different pricing <b>plans</b> to choose the one that best fits your needs. Remember to review the <b>terms and conditions</b> before finalizing your selection.
                        </p>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div style={{ marginLeft: '1.5%', color: 'black', margin: '1% 7% 1% 7%' }}>
                        <h2 style={{ marginBottom: '9px' }}>
                            <FontAwesomeIcon style={{ color: 'gray' }} icon={faCoins} /> <b style={{ color: '#018749' }}>Costing</b>
                        </h2>
                        <p>
                            <b>1. Advertisement Cost:</b> Each advertisement costs 20 INR per video.
                        </p>
                        <p>
                            <b>2. Slots:</b> Depending on the package chosen, slots are allocated as follows:
                            <ul>
                                <li><b>Basic:</b> 2 videos per semester</li>
                                <li><b>Pro:</b> 4 videos per semester</li>
                                <li><b>Premium:</b> 6 videos per semester</li>
                            </ul>
                            The basic advertisement cost is multiplied based on the package: <b>1x</b> for Basic, <b>2x</b> for Pro, and <b>3x</b> for Premium.
                        </p>
                        <p>
                            <b>3. Viewer Cost:</b> Viewer cost varies based on the number of viewers:
                            <ul>
                                <li>≤ 5,000: Free</li>
                                <li>5,001 - 10,000: 0.10 INR per viewer</li>
                                <li>10,001 - 20,000: 0.20 INR per viewer</li>
                                <li>20,001 - 40,000: 0.30 INR per viewer</li>
                            </ul>
                        </p>
                        <p>
                            <b>4. Terms and Conditions:</b> It is essential to read the terms and conditions thoroughly before selecting a package. By understanding the terms, you can ensure transparency and clarity in the advertisement costing process.
                        </p>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div style={{ marginLeft: '1.5%', color: 'black', margin: '1% 7% 1% 7%' }}>
                        <h2 style={{ marginBottom: '20px' }}>
                            <FontAwesomeIcon style={{ color: 'black' }} icon={faRectangleList} /> <b style={{ color: 'black' }}>Terms & Conditions</b>
                        </h2>
                        <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '18px' }}>
                            <li style={{ marginBottom: '15px' }}>
                                <b><FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginRight: '10px' }} /></b>
                                Your ad will be displayed for <b>24 hours</b> only. To extend the duration, you will need to purchase a new plan.
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <b><FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginRight: '10px' }} /></b>
                                Our algorithm optimizes ad visibility, but we do <b>not guarantee</b> that your ad will be shown to all registered users.
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <b><FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginRight: '10px' }} /></b>
                                When you purchase any advertising package, the advertisement will begin on the <b>allotted date</b>. If there are no other advertisements scheduled for the college, your ad will start at <b>12 AM</b> the next day.
                            </li>
                            <li>
                                <b><FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginRight: '10px' }} /></b>
                                Direct contracting with students for advertising purposes will result in the <b>banning</b> of your profile and the student's profile from PeerTeach.
                            </li>
                        </ul>
                    </div>

                </Carousel.Item>
                <Carousel.Item>
                    <div >
                        {/* <div style={{ marginLeft: '5%', width: '35%', height: '350px', border: '2px solid black', borderRadius: '30px', backgroundColor: '#d9f0f4' }}>
                            <FormControl style={{ padding: '4% 8% 4% 8%' }}>
                                <div style={{ marginBottom: '9%' }}>
                                    <p><b>Number of Students per Semester</b></p>
                                    <Input
                                        id='slots'
                                        name="slots"
                                        onChange={handleChange}
                                        value={formData.slots}
                                        type='number'
                                        placeholder='between 1 and 3'
                                        required />
                                </div>

                                <div style={{ marginBottom: '9%' }}>
                                    <FormLabel><b>Select Duration (in seconds)</b></FormLabel>
                                    <select
                                        id="durationSelect"
                                        name="secs"
                                        onChange={handleChange}
                                        value={formData.secs}
                                        type='number'
                                        required
                                    >
                                        <option value="4">4 seconds</option>
                                        <option value="5">5 seconds</option>
                                        <option value="10">10 seconds</option>
                                        <option value="20">20 seconds</option>
                                        <option value="30">30 seconds</option>
                                        <option value="60">60 seconds</option>

                                    </select>
                                </div>
                                <div style={{ marginBottom: '9%' }}>
                                    <FormLabel><b>Upload Image or Video</b></FormLabel>
                                    <input
                                        name='ad'
                                        ref={fileInputRef}
                                        type='file'
                                        accept='image/*, video/*'
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <button className='select-button' onClick={() => fileInputRef.current.click()}><FontAwesomeIcon icon={faUpload} flip="horizontal" /> Upload</button><span>{filename && <p> {filename}</p>}</span>

                                </div>
                                <div className="ci">
                                    <button className='invoice-button' variant='ghost' onClick={invoiceClicked}>
                                        Create Invoice
                                    </button>
                                </div>
                            </FormControl>
                        </div> */}
                        <h1 style={{ marginLeft: '11%' }}><b><FontAwesomeIcon style={{ color: '#FFDF00' }} icon={faCrown} /> Plans</b></h1>
                        <div className="flex justify-center" style={{ width: '80%', marginLeft: '9.8%' }}>
                            <div className="columnsp">
                                <ul className="pricep">
                                    <li style={{ backgroundColor: '#909090' }} className="headerp">Basic</li>
                                    <li className="greyp"><FontAwesomeIcon icon={faVideo} /> 2 Videos / sem</li>
                                    <li className="greyp" style={{ fontSize: '18px' }}> <FontAwesomeIcon icon={faInr} /> {vc} Viewer Cost</li>
                                    <li style={{ backgroundColor: '#D3D3D3' }}><b><FontAwesomeIcon icon={faInr} /> {costslot1} / day</b></li>
                                    <li className="greyp"><button className="buttonp" onClick={handleShowbs}>Purchase</button></li>
                                </ul>
                            </div>

                            <div className="columnsp">
                                <ul className="pricep">
                                    <li style={{ backgroundColor: ' #4CAF50' }} className="headerp">Pro</li>
                                    <li className="greyp"> <FontAwesomeIcon icon={faVideo} /> 4 Videos / sem</li>
                                    <li className="greyp" style={{ fontSize: '18px' }}> <FontAwesomeIcon icon={faInr} /> {vc} Viewer Cost</li>
                                    <li style={{ backgroundColor: '#b7dfb9' }} ><b><FontAwesomeIcon icon={faInr} /> {costslot2} / day</b></li>
                                    <li className="greyp"><button className="buttonp" onClick={handleShowpr} >Purchase</button></li>
                                </ul>
                            </div>

                            <div className="columnsp">
                                <ul className="pricep">
                                    <li style={{ backgroundColor: ' #FFC107' }} className="headerp">Premium</li>
                                    <li className="greyp"><FontAwesomeIcon icon={faVideo} /> 6 Videos / sem</li>
                                    <li className="greyp" style={{ fontSize: '18px' }}> <FontAwesomeIcon icon={faInr} /> {vc} Viewer Cost</li>
                                    <li style={{ backgroundColor: ' #FFEAAE' }}><b><FontAwesomeIcon icon={faInr} /> {costslot3} / day</b></li>
                                    <li className="greyp">
                                        <button className="buttonp" onClick={handleShowpm}>Purchase</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Please Upload Video of your ad</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <input
                                        name='ad'
                                        ref={fileInputRef}
                                        type='file'
                                        accept='image/*, video/*'
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <button className='select-button' onClick={() => fileInputRef.current.click()}><FontAwesomeIcon icon={faUpload} flip="horizontal" /> Upload</button><span>{filename && <p> {filename}</p>}</span>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={proceedClicked}>
                                    Pay
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={show2} onHide={handleClose2} centered>
                            <Modal.Body >
                                <div style={{ textAlign: 'center' }}>
                                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '50px', marginBottom: '20px' }} />
                                    <h2 style={{ color: 'green', fontWeight: 'bold', marginBottom: '20px' }}>Hurray! You are all set</h2>
                                    <p>Your ad will be on the board on this date:</p>
                                    <h5 style={{ fontWeight: 'bold', color: 'green' }}><FontAwesomeIcon icon={faCalendar} /> <span style={{ fontWeight: 'normal', color: 'green' }}><b>{allotDate}</b></span></h5>
                                    <p>Mark your calendar!</p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer style={{ borderTop: '2px solid green' }}>
                                <Button variant="secondary" onClick={handleClose2}>
                                    <b>Close</b>
                                </Button>
                                <a style={{textDecoration:'none', textDecorationColor:'black'}} href='/myBills'>
                                <Button style={{ backgroundColor: 'green', color: 'white' }} variant="primary">
                                    My Bills
                                </Button>
                                </a>
                            </Modal.Footer>
                        </Modal>
                        {/* <Drawer
                            isOpen={isOpen}
                            placement='right'
                            onClose={onClose}
                            finalFocusRef={btnRef}
                        >
                            <DrawerOverlay />
                            <DrawerContent
                                style={{
                                    marginTop: '9%',
                                    maxWidth: '40%',
                                    maxHeight: '70vh', // Set maximum height
                                    backgroundColor: '#e9e9e9',
                                    marginRight: '7%',
                                    border: '2px solid black',
                                    borderRadius: '40px 0px 40px 0px',
                                    overflowY: 'auto' // Enable vertical scrolling
                                }}
                            >
                                <DrawerBody style={{ textAlign: 'center' }}>
                                    <div style={{
                                        marginLeft: '93%',
                                        marginTop: '2%',
                                        cursor: 'pointer'
                                    }}

                                        onClick={onClose}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </div>
                                    <div style={{ padding: '5%' }}>
                                        {slclStudents}
                                        <br />
                                        {selectedCollege.name}
                                        <br />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consequat nisl vel pretium lectus quam id. Semper quis lectus nulla at volutpat diam ut venenatis. Dolor morbi non arcu risus quis varius quam quisque. Massa ultricies mi quis hendrerit dolor magna eget est lorem. Erat imperdiet sed euismod nisi porta. Lectus vestibulum mattis ullamcorper velit.
                                    </div>

                                </DrawerBody>
                            </DrawerContent>
                        </Drawer> */}
                    </div>
                </Carousel.Item>
            </Carousel>
            {
                profile &&
                <Profile_Busi onClose={profile_show} />
            }

        </>
    );
}

export default Purchaseform;
