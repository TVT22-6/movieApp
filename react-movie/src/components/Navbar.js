import { useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa"
import "../styles/navbar.css"

function Navbar() {
    const navRef = useRef();
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }
    return (
        <header>
            <h4>NWADB</h4>
            <nav ref={navRef}>
                <a href="/#">Home</a>
                <a href="/#">Group</a>
                <a href="/#">Reviews</a>
                <a button classname="login-button">Login</a>

                <button className="nav-button nav-close-button" onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <button className="nav-button" onClick={showNavbar}>
                <FaBars />
            </button>
        </header>
    )
}

export default Navbar;