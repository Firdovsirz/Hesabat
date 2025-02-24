"use client";

import React from 'react';
import Image from 'next/image';
import styles from "./TokenError.module.scss";
import Warning from "@/../public/assets/warning.png";

export default function TokenError() {
    return (
        <div className={styles['token-error-container']}>
            <div>
                <Image src={Warning} alt='warning' className={styles['token-error-warning-img']}/>
                <div className={styles['token-error-line']} />
                <p>Səhifə üçün token tapılmadı.</p>
            </div>
        </div>
    )
}
