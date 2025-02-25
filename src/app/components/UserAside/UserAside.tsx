'use client';

import Link from 'next/link';
import { RootState } from '@/redux/store';
import apiClient from '@/utils/apiClient';
import { useSelector } from 'react-redux';
import styles from './UserAside.module.scss';
import { usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface AsideProp {
    kafedra: string | any;
}

export default function UserAside(kafedra: AsideProp) {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const toggleMenu = () => setIsOpen(!isOpen);
    const pathname = usePathname();
    const [home, setHome] = useState(false);
    const [settings, setSettings] = useState(false);
    const [kafedralar, setKafedralar] = useState<{ kafedra_adi: string; kafedra_kodu: string }[]>([]);
    const [vezifeKodu, setVezifeKodu] = useState<string | null>(null);
    const [kafedraDropdown, setKafedraDropdown] = useState<boolean | null>(false);
    const username = useSelector((state: RootState) => state.auth.username);
    const [userAd, setUserAd] = useState<string | null>("");
    const [userSoyad, setUserSoyad] = useState<string | null>("");
    const [kafedraName, setkafedraName] = useState<string | null>("");

    const handleKafedraNameFromAside = (kafedra: string | null): void => {
        setkafedraName(kafedra);
        console.log(kafedra);

    }

    useEffect(() => {
        if (pathname === '/user') {
            setHome(true);
            setSettings(false);
        } else if (pathname === '/user/settings') {
            setSettings(true);
            setHome(false);
        }
    }, [pathname]);
    const handleKafedraDropdown = (): void => {
        setKafedraDropdown((prev) => !prev);
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await apiClient.get(`/fetch_user_details/${username}`);

                if (response.status < 200 || response.status >= 300) {
                    throw new Error('Failed to fetch user details');
                }

                const data = response.data;

                if (data.length > 0) {
                    const kodu = data[0].vezife_kodu;
                    setVezifeKodu(kodu);
                    setUserAd(data[0].ad);
                    setUserSoyad(data[0].soyad);

                    if (kodu === 1) {
                        fetchKafedralar(data[0].fakulte_kodu);
                    }
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        const fetchKafedralar = async (fakulteKodu: string) => {
            try {
                const response = await apiClient.get(`/kafedra_as_fac/${fakulteKodu}`);

                if (response.status < 200 || response.status >= 300) {
                    throw new Error('Failed to fetch kafedralar');
                }

                const data = response.data;

                // ✅ Ensure kafedralar is an array of objects
                setKafedralar(
                    data.map((item: { kafedra_adi: string; kafedra_kodu: string }) => ({
                        kafedra_adi: item.kafedra_adi,
                        kafedra_kodu: item.kafedra_kodu,
                    }))
                );
            } catch (error) {
                console.error("Error fetching kafedralar:", error);
            }
        };

        fetchUserDetails();
    }, []);
    // console.log(`kafedralar: ${kafedralar[0]}`);


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
                    <h1>{userAd} {userSoyad}</h1>
                    {/* <p>Vəzifə Kodu: {vezifeKodu || "Yüklənir..."}</p> */}
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
            {kafedralar.length > 0 && (
                <div
                    className={styles['user-aside-home-icon-container']}
                // style={home ? { background: "#1089ff", borderRadius: "10px 0 0 10px" } : {}}
                >
                    <div className={styles['user-aside-kafedra-dropdown-txt']} onClick={handleKafedraDropdown}>
                        <div className={styles['user-aside-kafedra-icon-container']}>
                            <SchoolIcon className={styles['user-aside-kafedra-icon']} />
                            <p>Kafedralar</p>
                        </div>
                        <ArrowDropDownIcon
                            className={styles['user-aside-kafedra-dropdown-icon']}
                            style={kafedraDropdown ? { rotate: "180deg" } : {}}
                        />
                    </div>
                    {kafedraDropdown && isOpen ? (
                        <div className={styles['user-aside-kafedra-dropdown']}>
                            {kafedralar.map((kafedra, index) => {
                                return (
                                    <Link
                                        href={`/user/kafedra/${kafedra.kafedra_kodu}`}
                                        className={styles['user-aside-kafedra-link']}
                                        key={index}
                                    >
                                        <div
                                            className={styles['user-aside-kafedra-txt']}
                                            onClick={() => handleKafedraNameFromAside(kafedra.kafedra_kodu)}
                                        >
                                            <p>{kafedra.kafedra_adi}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            )}
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