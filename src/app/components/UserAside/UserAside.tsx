'use client';

import Link from 'next/link';
import styles from './UserAside.module.scss';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter, usePathname } from 'next/navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function UserAside() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const toggleMenu = () => setIsOpen(!isOpen);
    const pathname = usePathname();
    const [home, setHome] = useState(false);
    const [settings, setSettings] = useState(false);

    useEffect(() => {
        if (pathname === '/user') {
            setHome(true);
            setSettings(false);
        } else if (pathname === '/user/settings') {
            setSettings(true);
            setHome(false);
        }
    }, [pathname]);

    return (
        <aside
            className={styles['user-aside']}
            style={isOpen ? { width: '300px' } : { width: '80px' }}
        >
            {!isOpen ? (
                <MenuIcon className={styles['menu-icon']} onClick={toggleMenu} />
            ) : (
                <CloseIcon className={styles['close-icon']} onClick={toggleMenu} />
            )}
            <div className={styles['user-aside-profile-container']}>
                <AccountCircleIcon className={styles['user-aside-profile-icon']} />
                <div className={styles['user-aside-pr-txt']}>
                    <h1>Ad Soyad</h1>
                    <p>Vezifesi</p>
                </div>
            </div>
            <Link href={'/user'} className={styles['user-aside-home-link']}>
                <div
                    className={styles['user-aside-home-icon-container']}
                    style={home ? { background: "#1089ff", borderRadius: "10px 0 0 10px" } : {}}
                >
                    <HomeIcon className={styles['user-aside-home-icon']} style={home ? { color: "#fff" } : {}} />
                    <p style={home ? { color: "#fff" } : {}}>Əsas</p>
                </div>
            </Link>
            <Link href={'/user/settings'} className={styles['user-aside-settings-link']}>
                <div
                    className={styles['user-aside-settings-icon-container']}
                    style={settings ? { background: '#1089ff', borderRadius: "10px 0 0 10px" } : {}}
                >
                    <SettingsIcon className={styles['user-aside-settings-icon']} style={settings ? { color: "#fff" } : {}} />
                    <p style={settings ? { color: "#fff" } : {}}>Sazlamalar</p>
                </div>
            </Link>
        </aside>
    );
}