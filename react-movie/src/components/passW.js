import {useState } from "react";

import axios from "axios";
import '../styles/Settings.css';


function PasswordChangeForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        if (newPassword !== confirmNewPassword) {
            setMessage("New passwords do not match!");
            return;
        }
    
        setIsLoading(true);
        try {
            const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from local storage
    
            if (!token) {
                setMessage('No authentication token found. Please log in.');
                return;
            }
    
            await axios.put('http://localhost:3001/user/change-password', 
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            setMessage("Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            const errorMessage = error.response?.data.error || error.message || "An error occurred";
            setMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input 
                type="password" 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
                placeholder="Current Password" 
            />
            <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="New Password" 
            />
            <input 
                type="password" 
                value={confirmNewPassword} 
                onChange={e => setConfirmNewPassword(e.target.value)} 
                placeholder="Confirm New Password" 
            />
            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Changing..." : "Change Password"}
            </button>
            {message && <div>{message}</div>}
        </div>
    );
}

export {PasswordChangeForm};