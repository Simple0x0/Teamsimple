import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import LeftSideBar from './LeftSideBar';
import style from '../../../app/Style';
import { DashboardUserProvider } from '../context/DashboardUserContext';
import { PrivateRoute } from '../Auth/AuthPrivateRoute';

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


//ADDING LOADING - TO ENABLE AUTHENTICATION CHECK BEFORE FULL RENDERING

/*
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftSideBar from './LeftSideBar';
import style from '../../../app/Style';
import { DashboardUserProvider, useDashboardUser } from '../context/DashboardUserContext';
import { PrivateRoute } from '../Auth/AuthPrivateRoute'; // fixed double slash
import Loading from '../../public/ui/Loading';

// Component that can safely use the context
const DashboardContent = () => {
  const { loading } = useDashboardUser();

  if (loading) return <Loading />;

  return (
    <div className={style.DashboardLayout.wrapper}>
      <Header />
      <div className={style.DashboardLayout.body}>
        <LeftSideBar />
        <main className={style.DashboardLayout.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <PrivateRoute>
      <DashboardUserProvider>
        <DashboardContent />
      </DashboardUserProvider>
    </PrivateRoute>
  );
};

export default DashboardLayout;

*/