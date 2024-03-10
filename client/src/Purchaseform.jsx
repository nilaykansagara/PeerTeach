import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect, useRef } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Form, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { faTimeline, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';



function Purchaseform() {
    let ctemp = localStorage.getItem('selectedCollege');
    let sctemp = localStorage.getItem('slclStudents');
    const selectedCollege = JSON.parse(ctemp);
    const slclStudents = JSON.parse(sctemp);
    const [flag, setFlag] = useState(0);
    const [allotDate, setallotDate] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [proceedClick, setproceedClick] = useState(0);
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


    const invoiceClicked = () => {
        console.log("hello from add bill");
        const buserData = localStorage.getItem("buserData");
        const bdata = JSON.parse(buserData);
        let today = new Date();
        console.log("printing today date");
        console.log(today);

        const updatedFormData = {
            ...formData,
            busi_email: bdata.email,
            busi_name: bdata.owner_name,
            college_name: selectedCollege.name,
            college_users: slclStudents,
            purchase_date: today
        };

        setFormData(updatedFormData);
    };

    const proceedClicked = () => {
        const formDataToSend = new FormData();
        formDataToSend.append('slots', formData.slots);
        formDataToSend.append('secs', formData.secs);
        formDataToSend.append('ad', formData.ad);
        formDataToSend.append('purchase_date', formData.purchase_date);
        formDataToSend.append('busi_name', formData.busi_name);
        formDataToSend.append('busi_email', formData.busi_email);
        formDataToSend.append('college_name', formData.college_name);
        formDataToSend.append('college_users', formData.college_users);
        formDataToSend.append('bill_amount', formData.bill_amount);


        axios.post('http://localhost:3001/addBill', formDataToSend)
            .then((response) => {
                console.log(response.data);
                setproceedClick(1);
                setallotDate(response.data);
            })
            .catch((error) => {
                console.log("Error:", error);
                alert('Error creating invoice. Please try again.');
            });
    };

    useEffect(() => {
        if (formData.purchase_date) {
            axios.post('http://localhost:3001/createBill', { formData })
                .then((response) => {
                    console.log(response);
                    setFormData({ ...formData, bill_amount: parseInt(response.data) });
                    console.log(formData.bill_amount);
                })
                .catch((error) => {
                    console.log("Error:", error);
                    alert('Error creating invoice. Please try again.');
                });
        }
    }, [formData.purchase_date]);

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
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', cursor: 'pointer' }} aria-current="page" onClick={onOpen} isOpen={isOpen}><b>Help</b></a>
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            </div>





            <Carousel style={{ display: 'flex', backgroundColor: '#c9c0bb ', height: '475px', width: '97.50%', marginLeft: '1.3%' }}
                prevIcon={<span className="carousel-control-prev-icon" />}
                nextIcon={<span className="carousel-control-next-icon" />}
            >
                <Carousel.Item>
                    <div style={{ marginLeft: '1.5%', color: 'black', margin: '1% 7% 1% 7%', fontSize: '20px' }}>
                        <p>
                            You select <b>{selectedCollege.name}</b> to give advertisement which have total <b>{slclStudents}</b> registered student on Peerteach. Fill the below form to generate invoice for cost that you need to pay for advertisement
                        </p>
                        <p>
                            for cost and other for other plan please click on <b>Help</b>.
                        </p>
                        <p>
                            <b>Note: </b>here add will be run only for a day and if there is exam time add will be run bases on hour with different cost.
                        </p>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div style={{ marginLeft: '1.5%', color: 'black', margin: '1% 7% 1% 7%' }}>
                        <p>
                            You select <b>{selectedCollege.name}</b> to give advertisement which have total <b>{slclStudents}</b> registered student on Peerteach. Fill the below form to generate invoice for cost that you need to pay for advertisement
                        </p>
                        <p>
                            for cost and other for other plan please click on <b>Help</b>.
                        </p>
                        <p>
                            <b>Note: </b>here add will be run only for a day and if there is exam time add will be run bases on hour with different cost.
                        </p>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div style={{ marginLeft: '1.5%', color: 'black', margin: '1% 7% 1% 7%' }}>
                        <p>
                            You select <b>{selectedCollege.name}</b> to give advertisement which have total <b>{slclStudents}</b> registered student on Peerteach. Fill the below form to generate invoice for cost that you need to pay for advertisement
                        </p>
                        <p>
                            for cost and other for other plan please click on <b>Help</b>.
                        </p>
                        <p>
                            <b>Note: </b>here add will be run only for a day and if there is exam time add will be run bases on hour with different cost.
                        </p>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div style={{ display: 'flex' }}>
                        <div style={{ marginLeft: '5%', width: '35%', height: '350px', border: '2px solid black', borderRadius: '30px', backgroundColor: '#d9f0f4' }}>
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
                        </div>
                        <div>
                            {formData.bill_amount && <>
                                <p>Your amount is: {formData.bill_amount}</p>
                                <button onClick={proceedClicked}>proceed</button>
                            </>}
                            {proceedClick && <>
                                <p>Your advertisement is confirmed and stream on date: {allotDate}</p>
                            </>}
                        </div>
                        <Drawer
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
                        </Drawer>
                    </div >
                </Carousel.Item>
            </Carousel>


        </>
    );
}

export default Purchaseform;
