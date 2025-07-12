import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import style from '../../../app/Style';
import MobileSidebar from './MobileSidebar'; // Make sure this path is correct

export default function Header({member}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <header className={style.dashHeader.container}>
        <FaBars className={style.dashHeader.menuButton} onClick={toggleSidebar} />
        <div className={style.dashHeader.logo}>Team Simple</div>
        <div className={style.dashHeader.notification}>Notifications Area 🔔</div>
      </header>

      <MobileSidebar member={member} isOpen={sidebarOpen} onClose={closeSidebar} />
    </>
  );
}
