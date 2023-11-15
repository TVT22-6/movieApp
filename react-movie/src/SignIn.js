import React, { useState } from 'react';
import axios from "axios";

const RegistrationForm = () => {
    const [uname, setUname] = useState('');
    const [pw, setPw] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        axios.post('http://localhost:3001/user/register', { uname, pw })
            .then(resp => {
                // Handle successful registration
                console.log('Registration successful');
                setRegistrationStatus('Registration successful. Please log in.');
                // Optionally, redirect to login page or another action
            })
            .catch(error => {
                if (error.response) {
                    // Handle specific error response if any
                    console.log(error.response.data);
                    setRegistrationStatus('Registration failed: ' + error.response.data);
                } else {
                    // Handle general network errors
                    console.log("Error: ", error.message);
                    setRegistrationStatus('Registration failed: ' + error.message);
                }
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={uname}
                        onChange={(e) => setUname(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {registrationStatus && <p>{registrationStatus}</p>}
        </div>
    );
};

export default RegistrationForm;