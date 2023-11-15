import React, { useState } from 'react';
import axios from 'axios';

const DeleteUser = () => {

    const [DeleteStatus, setDeleteStatus] = useState('');

    const handleDelete = () => {
        axios.delete('http://localhost:3001/user/delete')
            .then(response => {
                console.log(response.data);
                setDeleteStatus('Delete successful. Information deleted.');
                // Handle the post-deletion process, e.g., log the user out, clear local state, redirect, etc.
            })
            .catch(error => {
                if (error.response) {
                    // Handle specific error response if any
                    console.log(error.response.data);
                    setDeleteStatus('Delete user failed: ' + error.response.data);
                } else {
                    // Handle general network errors
                    console.log("Error: ", error.message);
                    setDeleteStatus('Delete user failed: ' + error.message);
                }
            });
    };

    return (
        <div>
             <h2>Delete Your Account</h2>
            <p>This action is irreversible. Please proceed with caution.</p>
            <button onClick={handleDelete}>Delete My Account</button>
            {DeleteStatus && <p>{DeleteStatus}</p>}
        </div>
    );
};

export default DeleteUser;