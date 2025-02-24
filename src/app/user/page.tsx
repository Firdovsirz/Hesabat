"use client";

import Link from 'next/link';
import Image from 'next/image';
import { logout } from "@/redux/authSlice";
import styles from "./page.module.scss";
import React, { useEffect } from 'react';
import { RootState } from '@/redux/store';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import AztuLogo from "@/../public/assets/aztu-logo.png";
import UserAside from '../components/UserAside/UserAside';
import HesabatLogo from "@/../public/assets/hesabat-logo.jpg";
import ToastNotification from '../components/ToastNotification/ToastNotification';
import { useRouter } from 'next/navigation';
import TokenError from '../components/TokenError/TokenError';

export default function dekan() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
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
  }, [token])
  return (

    <>
      <ToastNotification message='Hesabat sisteminə xoş gəlmisiniz!' />
      <div className={styles['user-container']}>
        <UserAside />
        <main className={styles['user-home-main']}>
          <section className={styles['user-home-section']}>
            <h1>Plan Hesabat İnformasiya Sistemi</h1>
            <div className={styles['user-home-img-container']}>
              <Image src={HesabatLogo} alt='hesabat-logo' className={styles['user-hesabat-image']} />
              <Image src={AztuLogo} alt='hesabat-logo' className={styles['user-aztu-image']} />
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
