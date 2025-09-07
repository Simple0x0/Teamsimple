import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from '../../../app/Style';
import { FaDiscord, FaYoutube , FaGithub, FaLinkedinIn, FaPhone, FaFacebook  } from "react-icons/fa";
import { FaXTwitter as FaXTwitter6 } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import fetchContacts from '../utils/fetchContacts';


export default function FooterModule() {
  const currentYear = new Date().getFullYear();
  const [contacts, setContacts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Helper to normalize DB icon names to PascalCase React icon names
  function normalizeIconName(icon) {
    if (!icon) return '';
    const lower = icon.toLowerCase();
    if (lower === 'faxtwitter' || lower === 'fax-twitter' || lower === 'fa-x-twitter') {
      return 'FaXTwitter';
    }
    if (lower.startsWith('fa')) {
      return 'Fa' + icon.slice(2).replace(/(^[a-z])|([a-z])([A-Z])/g, (m, a) => a ? a.toUpperCase() : m).replace(/([a-z])([A-Z])/g, '$1$2').replace(/in$/, 'In');
    }
    if (lower.startsWith('md')) {
      return 'Md' + icon.slice(2).replace(/(^[a-z])/, (m) => m.toUpperCase());
    }
    return icon;
  }

  // Map normalized icon names to React icon components
  const iconMap = {
    FaDiscord: FaDiscord,
    // FaYoutube: FaYoutube,
    FaXTwitter: FaXTwitter6,
    MdEmail: MdEmail,
    FaGithub: FaGithub,
    // FaLinkedinIn: FaLinkedinIn,
    // FaPhone: FaPhone,
    // FaFacebook: FaFacebook,
  };

  useEffect(() => {
    fetchContacts()
        .then(data => setContacts(data ?? []))
      .catch(() => setError('Failed to load contacts'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={style.footer.mainContainer}>
      <div className={style.footer.iconContainer}>
        {loading && <span className="text-xs text-slate-400">Loading...</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
        {!loading && !error && contacts.map((contact, idx) => {
          const normalized = normalizeIconName(contact?.Icon);
          const Icon = iconMap?.[normalized];
          if (!Icon) return null; // Only show icons that are enabled in iconMap
          return (
            <a
              key={contact?.ID ?? idx}
              href={contact?.URL ?? '#'}
              className={style.footer.iconLink}
              aria-label={contact?.Platform ?? ''}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon />
            </a>
          );
        })}
      </div>

      <div className={style.footer.otherinfoContainer}>
        <p className="text-xs text-slate-400 text-center">Team Simple - All Rights Reserved &copy; {currentYear}</p>
      </div>
    </div>
  );
}

