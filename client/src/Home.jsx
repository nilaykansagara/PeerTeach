import { useState, useEffect } from "react";
import React from 'react';
import './home.css';
import Fingerprint2 from "fingerprintjs2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAd, faChalkboardUser } from "@fortawesome/free-solid-svg-icons";

function Home() {
    useEffect(() => {
        const generateFingerprint = async () => {
            try {
                const fingerprintValue = await new Promise((resolve, reject) => {
                    Fingerprint2.get((components) => {
                        const fingerprint = Fingerprint2.x64hash128(components.map(pair => pair.value).join(), 31);
                        resolve(fingerprint)
                    });
                });
                console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIiiiiiiiiiiiii")
                console.log(fingerprintValue);
                localStorage.setItem('fingerprint', fingerprintValue);

            } catch (error) {
                console.log("Fingerprint error");
            }
        }
        generateFingerprint();
    }, [])
    return (
        <div className="full-screen">
            <header>
                <nav>
                    <ul>
                        <li></li>
                    </ul>
                </nav>
                <a style={{
                    fontWeight: 'bold',
                    fontSize: '40px',
                    color: 'transparent',
                    background: 'linear-gradient(to bottom right, #ff4d4d, #007bff)',
                    WebkitBackgroundClip: 'text', // Enable background clipping for text
                    textDecoration: 'none', // Remove underline
                    textAlign: 'center'
                }} class="navbar-brand" href="/">PeerTeach</a>
                <nav>
                    <ul>
                        <li></li>
                    </ul>
                </nav>
            </header>

            <section className="hero" style={{ height: '40%' }}>
                <div className="hero-content" style={{ marginTop: '2%' }}>
                    <h2>Welcome to PeerTeach,</h2>
                    <p style={{ marginBottom: '9%' }}>Your Gateway to Learning and Advertising Excellence! <br /> Discover a platform where knowledge-sharing meets strategic outreach,<br /> empowering both learners and businesses alike.</p>
                    <span >
                        <a className="xyz" href="/videos"><FontAwesomeIcon style={{ color: '#ff4d4d', fontSize: '20px' }} icon={faChalkboardUser} /> &nbsp; PeerTeach learning platform! </a>
                        <a className="xyz" style={{ marginLeft: '100px', marginBottom: '6%' }} href="/Busilogin"><FontAwesomeIcon style={{ color: '#ff4d4d', fontSize: '20px' }} icon={faAd} /> &nbsp; PeerTeach advertising platform!</a></span>

                </div>
            </section >




            {/* Add other sections as per your requirements */}

            < footer style={{ height: '100%' }
            }>
                <p>&copy; 2024 PeerTeach. All rights reserved.</p>
            </footer >
        </div >
    );
}

export default Home