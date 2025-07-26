import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../utils/apiRequest';
import { useDashboardUser } from '../context/DashboardUserContext';
import {
  FaFileAlt, FaClipboardList, FaProjectDiagram, FaPodcast,
  FaTrophy, FaUsers, FaBullseye, FaEye, FaCalendarAlt,
  FaEnvelope, FaUserPlus, FaThLarge, FaSignOutAlt, FaUsersCog
} from "react-icons/fa";
import style from '../../../app/Style';

export const navItems = [
  { path: "/dashboard//", icon: FaThLarge, label: "Dashboard" },
  { path: "/dashboard/blogs", icon: FaFileAlt, label: "Blogs" },
  { path: "/dashboard/writeups", icon: FaClipboardList, label: "WriteUps" },
  { path: "/dashboard/projects", icon: FaProjectDiagram, label: "Projects" },
  { path: "/dashboard/podcasts", icon: FaPodcast, label: "Podcasts" },
  { path: "/dashboard/achievements", icon: FaTrophy, label: "Achievements" },
  { path: "/dashboard/who-we-are", icon: FaBullseye, label: "Who We Are" },
  // { path: "/dashboard/vision-mission", icon: FaBullseye, label: "Vision & Mission" },
  // { path: "/dashboard/team", icon: FaEye, label: "The Team" },
  // { path: "/dashboard/values", icon: FaTrophy, label: "Our Values" },
  { path: "/dashboard/events", icon: FaCalendarAlt, label: "Events" },
  { path: "/dashboard/contact", icon: FaEnvelope, label: "Contacts" },
  { path: "/dashboard/contributors", icon: FaUserPlus, label: "Contributors" },
];

export default function LeftSideBar() {
  const { member, loading } = useDashboardUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); 
    navigate('/login');
  };

  return (
    <aside className={style.dashSideBar.asideContainer}>
      {/* Top Navigation */}
      <div className="space-y-3">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            to={path}
            key={path}
            className={({ isActive }) =>
              `${style.dashSideBar.menuItem} ${isActive ? `${style.dashSideBar.menuItemActive}` : ''}`
            }
          >
            <Icon className={style.dashSideBar.Icon} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Only visible to admins */}
        {(member?.Role === 'Superadmin' || member?.Role === 'Admin') && (
          <NavLink
            to="/dashboard/team-management"
            className={({ isActive }) =>
              `${style.dashSideBar.menuItem} ${isActive ? `${style.dashSideBar.menuItemActive}` : ''}`
            }
          >
            <FaUsersCog className={style.dashSideBar.Icon} />
            <span>Team Management</span>
          </NavLink>
        )}
      </div>

      {/* Footer Area */}
      <div className={style.dashSideBar.footerContainer}>
        <NavLink to="/dashboard/profile" className={style.dashSideBar.footerProfile}>
          <img
            src={member?.photoURL || '/default-avatar.jpg'}
            alt="Profile"
            className={style.dashSideBar.footerProfileImg}
          />
          <span>{member?.Username}</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className={`${style.dashSideBar.menuItem} `}
        >
          <FaSignOutAlt className={style.dashSideBar.Icon}  />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
