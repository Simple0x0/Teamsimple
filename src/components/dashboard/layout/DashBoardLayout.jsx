import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import LeftSideBar from './LeftSideBar';
import style from '../../../app/Style';
import { DashboardUserProvider } from '../context/DashboardUserContext';
import { PrivateRoute } from '..//Auth/AuthPrivateRoute';

const DashBoardLayout = () => {

   return (
    <PrivateRoute>
      <DashboardUserProvider>
        <div className={style.DashboardLayout.wrapper}>
          <Header />
          <div className={style.DashboardLayout.body}>
            <LeftSideBar />
            <main className={style.DashboardLayout.content}>
              <Outlet />
            </main>
          </div>
        </div>
      </DashboardUserProvider>
    </PrivateRoute>
  );
};

export default DashBoardLayout;
