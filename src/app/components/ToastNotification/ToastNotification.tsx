"use client";

import React, { useEffect, useState } from 'react';
import styles from "./ToastNotification.module.scss";

interface ToastProps {
    message: string;
}

export default function ToastNotification({ message }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Set a timer to hide the toast after 2 seconds
        const timer = setTimeout(() => {
            setVisible(false); // Hide toast after 2 seconds
        }, 10000);

        // Cleanup the timer when component unmounts
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