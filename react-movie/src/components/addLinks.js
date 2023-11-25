import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtToken} from "./Signals";
import '../styles/personalPage.css'; // Make sure to create this CSS file

const AddLinkForm = () => {
    const [linkName, setLinkName] = useState('');
    const [personalLink, setPersonalLink] = useState('');
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
            personalLink
        };

        try {
            const response = await axios.post('http://localhost:3001/user/addLink', body, { headers });
            console.log(response.data);
            setStatusMessage('Link added successfully!');
            // Optionally, clear the form
            setLinkName('');
            setPersonalLink('');
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
                <button type="submit" className="submit-button">Add Link</button>
            </form>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
        </div>
    );
};


    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fi-FI', options);
      };

      const LinkBox = () => {
        const [links, setLinks] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
    
        useEffect(() => {
            const fetchLinks = async () => {
                try {
                    const token = jwtToken.value;
                    const headers = { 'Authorization': `Bearer ${token}` };
                    const response = await axios.get('http://localhost:3001/user/getLinks', { headers });
                    setLinks(response.data);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Failed to fetch links:', error);
                    setIsLoading(false);
                }
            };
    
            fetchLinks();
        }, []);
    
        if (isLoading) {
            return <p>Loading links...</p>;
        }
    
        return (
            <div className="link-box">
                <h2>Your Links</h2>
                {links.length > 0 ? (
                    <ul>
                        {links.map((link, index) => (
                            <li key={index}>
                                <a href={link.personallink} target="_blank" rel="noopener noreferrer">
                                    {link.linkname || 'Unnamed Link'}
                                </a>
                                <div>Link added: {formatDate(link.dateadded)}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No links to display.</p>
                )}
            </div>
        );
    };

export { AddLinkForm, LinkBox };