import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFileAlt, FaClipboardList, FaProjectDiagram, FaPodcast, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import style from '../../../app/Style';

export default function LeftSideBar() {
    return (
        <div className={style.leftbarmenu.container}>
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
        </div>
    );
}
