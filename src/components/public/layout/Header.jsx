import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaFileAlt, FaClipboardList, FaProjectDiagram, FaPodcast, FaTrophy } from "react-icons/fa";
import style from "../../../app/Style";
import logo from "../../../assets/logo.png";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className={style.header.container}>
            <div className={style.header.contentContainer}>
                {/* Logo */}
                <img src={logo} alt="logo" className={style.header.logo} />

                {/* Right-aligned section (Main Hub, Team, and Menu Toggle) */}
                <div className="flex items-center space-x-4 ml-auto">
                    {/* Always visible */}
                    <NavLink to="/" className={style.header.menu}>Main Hub</NavLink>
                    <NavLink to="/team" className={style.header.menu}>Team</NavLink> {/* Implement Team Pages */}
                    <NavLink to="/login" className={style.header.menu}>Login</NavLink>
                    {/* Show Toggle Button Only on sm: & md: */}
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className={`${style.header.menuButton}`}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu (Only for sm: and md:) */}
            {menuOpen && (
                <div ref={menuRef} className={style.header.menudiv} >
                    <div className={style.header.mobileMenu}>
                        <NavLink to="/blogs" className={style.header.menu} onClick={() => setMenuOpen(false)}>
                            <FaFileAlt className={style.header.icon} /> Blogs
                        </NavLink>
                        <NavLink to="/writeups" className={style.header.menu} onClick={() => setMenuOpen(false)}>
                            <FaClipboardList className={style.header.icon} /> WriteUps
                        </NavLink>
                        <NavLink to="/projects" className={style.header.menu} onClick={() => setMenuOpen(false)}>
                            <FaProjectDiagram className={style.header.icon} /> Projects
                        </NavLink>
                        <NavLink to="/podcasts" className={style.header.menu} onClick={() => setMenuOpen(false)}>
                            <FaPodcast className={style.header.icon} /> PodCasts
                        </NavLink>
                        <NavLink to="/achievements" className={style.header.menu} onClick={() => setMenuOpen(false)}>
                            <FaTrophy className={style.header.icon} /> Achievements
                        </NavLink>
                    </div>
                </div>
            )}
        </div>
    );
}
