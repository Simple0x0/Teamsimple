import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaFileAlt, FaClipboardList, FaProjectDiagram, FaPodcast, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import style from '../../../app/Style';

export default function LeftSideBar() {
    const location = useLocation();
    const isTeamBar = location.pathname.startsWith('/team');

    if (isTeamBar) {
        return (
            <aside className={style.leftbarmenu.container + " flex flex-col h-full"}>
                <div className="flex flex-col flex-grow">
                    <NavLink to="/" className="flex items-center gap-2 text-lime-400 hover:text-lime-600 mb-6 py-2 px-4 rounded-lg transition-all shadow-md">
                        <span className="inline-flex items-center justify-center mr-2 animate-ping ">
                            <IoIosArrowRoundBack size={24} className="text-lime-400" />
                        </span>
                        <span >Return</span>
                    </NavLink>
                    <NavLink to="/team" className={style.header.menu}>Who We Are</NavLink>
                    <NavLink to="/team/vision-mission" className={style.header.menu}>Vision & Mission</NavLink>
                    <NavLink to="/team/values" className={style.header.menu}>Values</NavLink>
                    <NavLink to="/team/members" className={style.header.menu}>The Team</NavLink>
                </div>
                <div className="mt-auto">
                    <NavLink
                        className="mb-2 py-2 px-6 bg-none text-white font-bold rounded-full shadow-xl text-center border-2 border-lime-800  w-full"
                    >
                        Join Team
                    </NavLink>
                </div>
            </aside>
        );
    }

    return (
        <aside className={style.leftbarmenu.container}>
            <NavLink to="/blogs" className={style.leftbarmenu.menuItem}>
                <FaFileAlt className={style.leftbarmenu.icon} /> Blogs
            </NavLink>
            <NavLink to="/writeups" className={style.leftbarmenu.menuItem}>
                <FaClipboardList className={style.leftbarmenu.icon} /> WriteUps
            </NavLink>
            <NavLink to="/projects" className={style.leftbarmenu.menuItem}>
                <FaProjectDiagram className={style.leftbarmenu.icon} /> Projects
            </NavLink>
            <NavLink to="/podcasts" className={style.leftbarmenu.menuItem}>
                <FaPodcast className={style.leftbarmenu.icon} /> PodCasts
            </NavLink>
            <NavLink to="/achievements" className={style.leftbarmenu.menuItem}>
                <FaTrophy className={style.leftbarmenu.icon} /> Achievements
            </NavLink>
            <NavLink to="/events" className={style.leftbarmenu.menuItem}>
                <FaCalendarAlt className={style.leftbarmenu.icon} /> Events
            </NavLink>
        </aside>
    );
}
