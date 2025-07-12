import React from 'react';
import { Link } from 'react-router-dom';
import style from '../../../app/Style';
import { FaDiscord, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function FooterModule() {
  const currentYear = new Date().getFullYear();

  return (
    <div className={style.footer.mainContainer}>
      <div className={style.footer.iconContainer}>
        <Link to="/connect/discord" className={style.footer.iconLink} aria-label="Discord">
          <FaDiscord />
        </Link>
        <Link to="/connect/twitter" className={style.footer.iconLink} aria-label="Twitter">
          <FaXTwitter />
        </Link>
        <Link to="/connect/youtube" className={style.footer.iconLink} aria-label="YouTube">
          <FaYoutube />
        </Link>
        <Link to="/connect/email" className={style.footer.iconLink} aria-label="Email">
          <MdEmail />
        </Link>
      </div>

      <div className={style.footer.otherinfoContainer}>
        <p className="text-xs text-slate-400 text-center">Team Simple - All Rights Reserved &copy; {currentYear}</p>
      </div>
    </div>
  );
}
