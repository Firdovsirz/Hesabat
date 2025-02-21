import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./Aside.module.scss";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Aside() {
    const [dropdown, setDropdown] = useState(true);
    const [kafedralar, setKafedralar] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Fetch kafedralar data
    useEffect(() => {
        setLoading(true);
        axios.get('http://127.0.0.1:5000/kafedra_as_fac')
            .then(response => {
                console.log("API Response:", response.data); // Debugging line
                setKafedralar(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching kafedralar:", error);
                setError("Failed to load kafedralar");
                setLoading(false);
            });
    }, []);
    console.log(kafedralar);
    const handleDropdown = () => {
        setDropdown(!dropdown);
    }


    return (
        <aside className={styles.aside}>
            {/* Profile Section */}
            <div className={styles['aside-profile-container']}>
                <AccountCircleIcon style={{ color: "rgb(200, 200, 200)", fontSize: 40, marginBottom: 20 }} />
                <h1>{`Dekan ITT`}</h1>
            </div>

            {/* Kafedralar Section */}
            <div
                className={styles['aside-kafedralar']}
                onClick={handleDropdown}
            >
                Kafedralar
                <ArrowDropDownIcon style={{ color: "rgb(200, 200, 200)", marginLeft: 20 }} />
                {dropdown ? (
                    <div className={styles['dropdown-container']}>
                        {loading ? (
                            <p className={styles['dropdown-loading']}>Loading...</p>
                        ) : error ? (
                            <p className={styles['dropdown-error']}>{error}</p>
                        ) : kafedralar.length > 0 ? (
                            kafedralar.map((item, index) => (
                                <div key={index} className={styles['dropdown-item']}>
                                    {item.kafedra_adi}
                                </div>
                            ))
                        ) : (
                            <p className={styles['dropdown-empty']}>Heç bir kafedra mövcud deyil</p>
                        )}
                    </div>
                ) : null}
            </div>
        </aside>
    );
}