import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo.jpg";
import Aztu from "../../assets/aztu-logo.png";
import styles from "./Login.module.scss";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "dekanitt" && password === "itt2025") {
            navigate("/dekan");
        } else {
            alert("Yanlış istifadəçi adı və ya parol!");
        }
    };

    return (
        <main>
            <section>
                <div className={styles['img-container']}>
                    <img src={Logo} alt="logo" />
                    <img src={Aztu} alt="" />
                </div>
                <div className={styles['form-container']}>
                    <h1>Plan Hesabat Informasiya Sistemi</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="username">
                            <input 
                                type="text" 
                                placeholder='İstifadəçi adı' 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <label htmlFor="password">
                            <input 
                                type="password" 
                                placeholder='Parol' 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <button type="submit">Daxil Ol</button>
                    </form>
                </div>
            </section>
        </main>
    );
}
