import { useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa"
import { jwtToken, userData } from "./Signals";




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
                <a href="/#" onClick={() => handleTabClick('home')}>
                    Home
                </a>
                <a href="/#" onClick={() => handleTabClick('actors')}>
                    Actors
                </a>
                <a href="/#" onClick={() => handleTabClick('Review')}>
                    Review
                </a>
                {jwtToken.value.length === 0 && (
                    <a href="/#" onClick={() => handleTabClick('auth')}>
                        Log In
                    </a>
                )}
                {jwtToken.value.length > 0 && (
                    <a href="/#" onClick={handleLogout}>Log Out</a>
                )}

                <a href="/#" onClick={handleToggleTheme}>Toggle Theme
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