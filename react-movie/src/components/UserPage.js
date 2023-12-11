import React from 'react';
import {LinkBox} from './addLinks'; // Assuming LinkBox is in the same directory
import { PasswordChangeForm } from "./passW";
import DeleteUser from "../DeleteUser";
import '../styles/Settings.css';

const UserPage = () => {
    return (
        <div className="user-page">
            <h1>User Page</h1>
            <LinkBox />
            <PasswordChangeForm />
            <DeleteUser />
            {/* You can add more user-specific components here */}
        </div>
    );
};

export default UserPage;
