"use client";

import React, { useEffect, useState } from 'react';
import styles from "./ToastNotification.module.scss";

interface ToastProps {
    message: string;
}

export default function ToastNotification({ message }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`${styles.toast} ${visible ? styles.show : styles.hide}`}
        >
            {message}
        </div>
    );
}