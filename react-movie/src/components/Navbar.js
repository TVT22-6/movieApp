import { useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa"
import { jwtToken, userData } from "./Signals";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";




function Navbar({ setActiveTab, setTheme }) {
    const navRef = useRef();
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        showNavbar();
    };

    const handleLogout = () => {
        jwtToken.value = "";
        userData.value = null;
        setActiveTab("home");
        showNavbar();
    };

    const handleToggleTheme = () => {
        if (setTheme) {
            setTheme((theme) => (theme === "light" ? "dark" : "light"));
        }
        showNavbar();
    };

    return (
        <header>
            <h4>NWADB</h4>
            <nav ref={navRef}>
                <Link to="/home" onClick={() => handleTabClick('home')}>
                    Home
                </Link>
                <Link to="/actors" onClick={() => handleTabClick('actors')}>
                    Actors
                </Link>
                <Link to="/user" onClick={() => handleTabClick('user')}>
                    User
                </Link>
                <Link to="/getUser" onClick={() => handleTabClick('Profile')}>
                    Profile
                </Link>
                <Link to="/group" onClick={() => handleTabClick('Group')}>
                    Groups
                </Link>
                <Link to="/review" onClick={() => handleTabClick('Review')}>
                    Reviews
                </Link>
                {jwtToken.value.length === 0 && (
                    <Link to="/auth" onClick={() => handleTabClick('auth')}>
                        Log In
                    </Link>
                )}
                {jwtToken.value.length > 0 && (
                    <Link to="/auth" onClick={handleLogout}>
                        Log Out
                    </Link>
                )}

                <a onClick={handleToggleTheme}>Toggle Theme
                </a>


                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <button className="nav-btn" onClick={showNavbar}>
                <FaBars />
            </button>
        </header>
    );
}

export default Navbar;