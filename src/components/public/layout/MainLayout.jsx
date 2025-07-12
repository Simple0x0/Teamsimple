import React, { useEffect, useState } from 'react';
import Header from "./Header";
import RightSideBar from './RightSideBar';
import LeftSideBar from './LeftSideBar';
import style from "../../../app/Style";
import { Outlet } from "react-router-dom";
import Main from './MainLayout';
import { trackVisitor } from '../utils/visitorFingerPrint.js';
import VantaNetBackground from '../background/VantaNetBackground.jsx';
import ParticlesBackground from "../background/ParticlesBackground";


export default function Root() {
    useEffect(() => {
        const alreadyTracked = sessionStorage.getItem('fingerprint');

        if (!alreadyTracked) {
            trackVisitor().then(() => {
                sessionStorage.setItem('fingerprint', 'true');
            });
        }
    }, []);
    
    return (
        <>
        {/*<VantaNetBackground />*/}
        <VantaNetBackground />
            <div className={style.root.container}>
                <div className={style.root.contentContainer}>
                    <div className={style.header.container}>
                        <Header />
                    </div>
                    <main className={style.mainlayout.container}>
                        <div className={style.mainlayout.leftsidebar}>
                            <LeftSideBar />
                        </div>
                        <main className={style.mainlayout.main}>
                            <Outlet />
                        </main>
                        <div className={style.mainlayout.rightsidebar} >
                            <RightSideBar />
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
