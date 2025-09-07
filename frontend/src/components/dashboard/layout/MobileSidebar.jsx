import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaSignOutAlt, FaUsersCog } from 'react-icons/fa';
import { useDashboardUser } from '../context/DashboardUserContext';
import { logout } from '../utils/apiRequest';
import { navItems } from './LeftSideBar';
import style from '../../../app/Style';

export default function MobileSidebar({ isOpen, onClose }) {
  const { member, loading } = useDashboardUser();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      {isOpen && <div className={style.mobileSidebar.overlay} onClick={onClose} />}
      <aside className={`${style.mobileSidebar.container} ${isOpen ? style.mobileSidebar.visible : style.mobileSidebar.hidden}`}>
        <div className="space-y-3">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              to={path}
              key={path}
              className={({ isActive }) =>
                `${style.dashSideBar.menuItem} ${isActive ? style.dashSideBar.menuItemActive : ''}`
              }
              onClick={onClose}
            >
              <Icon className={style.dashSideBar.Icon} />
              <span className={style.dashSideBar.menuItemLabelMobile}>{label}</span>
            </NavLink>
          ))}

          {member?.Role === 'Admin' && (
            <NavLink
              to="/dashboard/team-management"
              className={({ isActive }) =>
                `${style.dashSideBar.menuItem} ${isActive ? style.dashSideBar.menuItemActive : ''}`
              }
              onClick={onClose}
            >
              <FaUsersCog className={style.dashSideBar.Icon} />
              <span className={style.dashSideBar.menuItemLabelMobile}>Team Management</span>
            </NavLink>
          )}
        </div>

        <div className={style.dashSideBar.footerContainer}>
          <NavLink to="/dashboard/profile" className={style.dashSideBar.footerProfile} onClick={onClose}>
            <img
              src={member?.photoURL || '/default-avatar.jpg'}
              alt="Profile"
              className={style.dashSideBar.footerProfileImg}
            />
            <span>{member?.Username}</span>
          </NavLink>
          <button onClick={handleLogout} className={style.dashSideBar.menuItem}>
            <FaSignOutAlt className={style.dashSideBar.Icon} />
            <span className={style.dashSideBar.menuItemLabelMobile}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
