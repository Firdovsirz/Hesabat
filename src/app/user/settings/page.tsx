"use client";

import styles from './page.module.scss';
import apiClient from '@/utils/apiClient';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/authSlice';
import { useRouter } from 'next/navigation';
import WorkIcon from '@mui/icons-material/Work';
import ClassIcon from '@mui/icons-material/Class';
import React, { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from 'react-redux';
import UserAside from '@/app/components/UserAside/UserAside';

interface userDetails {
  ad: string,
  soyad: string,
  ata_adi: string,
  vezife_adi: string,
  fakulte_adi: string
}

export default function Page() {
  const [userDetails, setUserDetails] = useState<userDetails | null>(null);
  const username = useSelector((state: RootState) => state.auth.username);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token) {
        router.push("/");
        return;
      }
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();
        if (currentTime >= expirationTime) {
          dispatch(logout()); // ✅ Dispatch logout action
          router.push("/");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        dispatch(logout());
        router.push("/");
      }
    };
    checkTokenExpiration();

    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get(`/fetch_user_details/${username}`);
        if (response.status >= 200 && response.status < 300) {
          setUserDetails(response.data[0]);
        } else {
          console.error(`Error: Received status code ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [username, token, dispatch, router]);

  const handleLogout = () => {
    dispatch(logout()); // ✅ Clear auth state and local storage
    router.push("/"); // ✅ Redirect to home page
  };

  return (
    <>
      <div className={styles['user-settings-container']}>
        <UserAside />
        <main className={styles['user-settings-main']}>
          <section className={styles['user-settings-head-txt-section']}>
            <h1>Plan Hesabat İnformasiya Sistemi</h1>
            <p>Sazlamalar</p>
          </section>
          <section className={styles['user-settings-user-details']}>
            {userDetails ? (
              <>
                <div className={styles['user-set-name-details']}>
                  <PersonIcon className={styles['user-set-icons']} />
                  <p>{userDetails.ad} {userDetails.soyad} {userDetails.ata_adi}</p>
                </div>
                <div className={styles['user-set-job-details']}>
                  <WorkIcon className={styles['user-set-icons']} />
                  <p>{userDetails.vezife_adi}</p>
                </div>
                <div className={styles['user-set-fac-details']}>
                  <ClassIcon className={styles['user-set-icons']} />
                  <p>{userDetails.fakulte_adi}</p>
                </div>
              </>
            ) : (
              <p>İstifadəçi məlumatları yüklənir...</p>
            )}
          </section>
          <section className={styles['user-set-log-out']} onClick={handleLogout}>
            <LogoutIcon className={styles['user-set-log-out-icon']} />
            <p>Çıxış edin</p>
          </section>
        </main>
      </div>
    </>
  );
}