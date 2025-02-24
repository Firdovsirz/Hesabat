"use client";

import Image from 'next/image';
import Swal from 'sweetalert2';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authSlice';
import apiClient from '@/utils/apiClient';
import { useRouter } from 'next/navigation';
import styles from "./LoginForm.module.scss";
import AztuLogo from "../../../../public/assets/aztu-logo.png";
import HesabatLogo from "../../../../public/assets/hesabat-logo.jpg";

export default function LoginForm() {
    const [visibility, setVisibility] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Make POST request using apiClient
            const response = await apiClient.post("/login", {
                username,
                password,
            });
            const data = response.data;
            if (response.status === 200 && data.token) {
                dispatch(login({ token: data.token, role: data.role, username: data.username }));
                console.log(data.token);
                router.push('/user');
            } else if (response.status === 401) {
                Swal.fire({
                    title: "Uğursuz cəhd",
                    text: "İstifadəçi adı və ya parol yanlışdır.",
                    icon: "error",
                });
            } else {
                Swal.fire({
                    title: "Uğursuz cəhd",
                    text: data.error || "İstifadəçi adı və ya parol yanlışdır.",
                    icon: "error",
                });
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    title: "Uğursuz cəhd",
                    text: "İstifadəçi adı və ya parol yanlışdır.",
                    icon: "error",
                });
            } else {
                Swal.fire({
                    title: "Xəta baş verdi",
                    text: "Serverlə əlaqə qurulmadı.",
                    icon: "error",
                });
            }
        }
    };

    return (
        <main className={styles['login-main']}>
            <section className={styles['login-section']}>
                <div className={styles['login-img-container']}>
                    <Image src={HesabatLogo} alt='hesabat-logo' className={styles['login-logo-hesabat']} />
                    <Image src={AztuLogo} alt='aztu-logo' className={styles['login-logo-aztu']} />
                </div>
                <div className={styles['login-form-container']}>
                    <h1>Plan Hesabat İnformasiya Sistemi</h1>
                    <form onSubmit={handleLogin}>
                        <div>
                            <input
                                type="text"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <div className={styles['input-placeholder']}>İstifadəçi adı</div>
                        </div>
                        <div>
                            <input
                                type={visibility ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className={styles['input-placeholder']}>Parol</div>
                        </div>
                        <button type="submit">Daxil Ol</button>
                    </form>
                </div>
            </section>
        </main>
    );
}