import React from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

function Purchaseform() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

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
                                    <a className="nav-link active" style={{ marginTop: '5px', color: '#C8C8C8', fontSize: '17px', cursor: 'pointer' }} aria-current="page" onClick={onOpen}><b>Help</b></a>
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ marginLeft: '1.3%', width: '30%', border: '2px solid black', borderRadius: '30px', backgroundColor: '#d9f0f4' }}>
                    <FormControl style={{ padding: '10% 15% 7% 15%' }}>
                        <div style={{ marginBottom: '9%' }}>
                            <FormLabel><b>Number of Students per Semester</b></FormLabel>
                            <Input type='number' placeholder='between 1 and 3' />
                        </div>
                        <div style={{ marginBottom: '9%' }}>
                            <FormLabel><b>Upload Image or Video</b></FormLabel>
                            <Input type='file' accept='image/*, video/*' />
                        </div>
                        <div style={{ marginBottom: '9%' }}>
                            <FormLabel><b>Select Duration (in seconds)</b></FormLabel>
                            <select id="durationSelect" name="durationSelect">
                                <option value="4">4 seconds</option>
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                                <option value="20">20 seconds</option>
                                <option value="30">30 seconds</option>
                                <option value="60">60 seconds</option>
                            </select>
                        </div>
                        <div className="ci">
                            <button className='invoice-button' variant='ghost'>
                                Create Invoice
                            </button>
                        </div>
                    </FormControl>
                </div>


                {/* <div style={{ width: '25%', border: '2px solid black', borderRadius: '90px 7px 90px 7px', backgroundColor: '#ffad99', marginLeft: 'auto', marginRight: '1.3%' }}>
                    <h3 style={{ textAlign: 'center' }}>Information</h3>
                </div> */}
                <Drawer
                    isOpen={isOpen}
                    placement='right'
                    onClose={onClose}
                    finalFocusRef={btnRef}
                >
                    <DrawerOverlay />
                    <DrawerContent
                        style={{
                            marginTop: '7%',
                            maxWidth: '40%',
                            maxHeight: '70vh', // Set maximum height
                            backgroundColor: '#e9e9e9',
                            marginRight: '1.3%',
                            border: '2px solid black',
                            borderRadius: '40px 0px 40px 0px',
                            overflowY: 'auto' // Enable vertical scrolling
                        }}
                    >
                        <DrawerBody style={{ textAlign: 'center' }}>
                            <div style={{ padding: '5%' }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consequat nisl vel pretium lectus quam id. Semper quis lectus nulla at volutpat diam ut venenatis. Dolor morbi non arcu risus quis varius quam quisque. Massa ultricies mi quis hendrerit dolor magna eget est lorem. Erat imperdiet sed euismod nisi porta. Lectus vestibulum mattis ullamcorper velit.
                            </div>
                            <Button
                                variant='outline'
                                position='absolute'
                                bottom='4%'
                                right='4%'
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>



            </div >
        </>
    );
}

export default Purchaseform;
