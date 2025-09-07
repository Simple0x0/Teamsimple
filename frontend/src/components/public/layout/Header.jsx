import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaFileAlt, FaClipboardList, FaProjectDiagram, FaPodcast, FaTrophy } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import style from "../../../app/Style";
import logo from "../../../assets/logo.png";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();
    const isTeamBar = location.pathname.startsWith('/team');

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
                    <NavLink to="/team" className={style.header.menu}>Team</NavLink>
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
                        {isTeamBar ? (
                            <>
                                <NavLink to="/" className="flex items-center gap-2 text-lime-400 hover:text-lime-600 mb-6 py-2 px-4 rounded-lg transition-all shadow-md">
                                    <span className="inline-flex items-center justify-center mr-2 animate-ping ">
                                        <IoIosArrowRoundBack size={24} className="text-slate-950" />
                                    </span>
                                    <span >Return</span>
                                </NavLink>
                                <NavLink to="/team" className={style.header.menu} onClick={() => setMenuOpen(false)}>Who We Are</NavLink>
                                <NavLink to="/team/vision-mission" className={style.header.menu} onClick={() => setMenuOpen(false)}>Vision & Mission</NavLink>
                                <NavLink to="/team/values" className={style.header.menu} onClick={() => setMenuOpen(false)}>Values</NavLink>
                                <NavLink to="/team/members" className={style.header.menu} onClick={() => setMenuOpen(false)}>The Team</NavLink>
                                <div className="mt-auto">
                                    <a
                                        href="https://discord.gg/kS6QTmm45M"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mb-2 py-2 px-6 bg-none text-white font-bold rounded-full shadow-xl text-center border-2 border-lime-800  w-full block"
                                    >
                                        Join Team
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
