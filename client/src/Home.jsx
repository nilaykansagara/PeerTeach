import { useState, useEffect } from "react";
import React from 'react';
import './home.css';
import Fingerprint2 from "fingerprintjs2";

function Home() {
    useEffect(() => {
        const generateFingerprint = async()=>{
            try{
                const fingerprintValue = await new Promise((resolve, reject) => {
                    Fingerprint2.get((components) => {
                        const fingerprint = Fingerprint2.x64hash128(components.map(pair => pair.value).join(), 31);
                        resolve(fingerprint)
                    });
                });
                console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIiiiiiiiiiiiii")
                console.log(fingerprintValue);
                localStorage.setItem('fingerprint', fingerprintValue);

            }catch(error)
            {
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
                    <h2>Peer-to-Peer Learning Made Easy</h2>
                    <p>Join PeerTeach and start sharing your knowledge with others.</p>
                    {/* <a href="/Signin">Sign In Now as Student</a><br /><br />
                    <a href="/Signin">Sign In Now as Businessman</a> */}
                    <a style={{ marginTop: '25%', marginBottom: '15%' }} href="/videos">Get Started!</a>
                </div>
            </section>

            {/* Add other sections as per your requirements */}

            <footer style={{ height: '100%' }}>
                <p>&copy; 2023 PeerTeach. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home