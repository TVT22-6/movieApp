import React, { useState } from 'react';
import axios from 'axios';
import { jwtToken} from "./Signals";

const AddLinkForm = () => {
    const [linkName, setLinkName] = useState('');
    const [personalLink, setPersonalLink] = useState('');
    const [shareable, setShareable] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Retrieve the JWT token from the jwtToken signal
        const token = jwtToken.value;

        if (!token) {
            setStatusMessage('Please log in to add links.');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const body = {
            linkName,
            personalLink,
            shareable
        };

        try {
            const response = await axios.post('http://localhost:3001/user/addLink', body, { headers });
            console.log(response.data);
            setStatusMessage('Link added successfully!');
            // Optionally, clear the form
            setLinkName('');
            setPersonalLink('');
            setShareable(false);
        } catch (error) {
            console.error(error);
            setStatusMessage('Failed to add link: ' + (error.response?.data.error || error.message));
        }
    };

    return (
        <div className="add-link-form">
            <h2>Add a New Link</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="linkName">Link Name/Description:</label>
                    <input
                        type="text"
                        id="linkName"
                        value={linkName}
                        onChange={e => setLinkName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="personalLink">Link:</label>
                    <input
                        type="url"
                        id="personalLink"
                        value={personalLink}
                        onChange={e => setPersonalLink(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="shareable">Shareable:</label>
                    <input
                        type="checkbox"
                        id="shareable"
                        checked={shareable}
                        onChange={e => setShareable(e.target.checked)}
                    />
                </div>
                <button type="submit" className="submit-button">Add Link</button>
            </form>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
    );
};

export default AddLinkForm;