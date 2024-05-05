import { useState } from "react";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import Home from "./Home";
import './home.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function Businesssignup() {
    const [owner_name, setName] = useState();
    const [phone_number, setPhone] = useState();
    const [email, setMail] = useState();
    const [password, setPass] = useState();
    const [shop_name, setshop_name] = useState();
    const [business_description, setDescription] = useState();
    const [address, setAddress] = useState();
    const [pincode, setPincode] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/busiregister', { owner_name, phone_number, email, shop_name, business_description, address, password, pincode })
            .then(result => {
                console.log(result.data.c); // Log the response data
                if (result.data.c == 1) {
                    console.log("Not Entered");
                    alert('Businessman with same Email is already exist');
                    // You can show an alert or perform other actions here for unsuccessful data entry
                } else {
                    console.log("Entered");
                    navigate('/Busilogin'); // Navigate to the '/menu' route on successful data entry
                }
            })
            .catch(err => console.log(err))

        if (Object.keys(result).length === 0) {
            console.log("Not Entered")
        }
        else {
            console.log("Entered")
            navigate('/BusinessmanHome')
        }
    }

    return (
        <div>
            <header>
                <p></p>
                <a style={{
                    fontWeight: 'bold',
                    fontSize: '40px',
                    color: 'transparent',
                    background: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                    WebkitBackgroundClip: 'text', // Enable background clipping for text
                    textDecoration: 'none', // Remove underline
                    textAlign: 'center'
                }} href="/">PeerTeach</a>
                <p></p>
            </header>

            <section className="hero" >
                <form onSubmit={handleSubmit} style={{ marginTop: '-6%', marginBottom: '0%' }}> {/*width: '1000px'*/}
                    <div className="container-fluid d-flex justify-content-center align-items-center"> {/** vh-100 */}
                        <div className="card text-black m-5" style={{ borderRadius: '25px', maxWidth: '1200px' }}> {/* height: '70%'*/}
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-10 col-lg-6 order-2 order-lg-1">
                                        <p className="text-center h1 fw-bold">Sign up</p>
                                        <div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-user me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Owner Name"
                                                            type="text"
                                                            value={owner_name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-envelope me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Your Email"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setMail(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-school me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Phone Number"
                                                            type="number"
                                                            value={phone_number}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-graduation-cap me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Your Shop Name"
                                                            type="text"
                                                            value={shop_name}
                                                            onChange={(e) => setshop_name(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-code-branch me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Business Description"
                                                            type="text"
                                                            value={business_description}
                                                            onChange={(e) => setDescription(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-graduation-cap me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Current Address"
                                                            type="text"
                                                            value={address}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-calendar me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Pincode"
                                                            type="number"
                                                            value={pincode}
                                                            onChange={(e) => setPincode(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                {/* <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-lock me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPass(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div> */}
                                                <div className="col-sm-6">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <i className="fas fa-lock me-3" style={{ fontSize: '24px' }}></i>
                                                        <input
                                                            className="form-control"
                                                            placeholder="Password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPass(e.target.value)}
                                                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{7,}"
                                                            title="Password must be at least 7 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special character."
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <button className="btn btn-primary" type="submit">Register</button>
                                        <p style={{ marginBottom: '-1%' }}>
                                            Already have an account? &nbsp;<Link to="/Busilogin">Sign In here</Link>
                                        </p>
                                    </div>
                                    <div className="col-md-10 col-lg-6 order-1 order-lg-2 d-flex align-items-center" style={{ marginBottom: '50px' }}>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" alt="Registration" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            <footer style={{ marginTop: '-5%' }}>
                <p>&copy; 2024 PeerTeach. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Businesssignup;
