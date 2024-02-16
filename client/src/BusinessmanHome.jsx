import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BusinessmanHome = () => {
    
    return(
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
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
        </>
    )
}

export default BusinessmanHome;