"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from "./page.module.scss";
import { RootState } from '@/redux/store';
import apiClient from '@/utils/apiClient';
import { logout } from "@/redux/authSlice";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AztuLogo from "@/../public/assets/aztu-logo.png";
import UserAside from '../components/UserAside/UserAside';
import TokenError from '../components/TokenError/TokenError';
import HesabatLogo from "@/../public/assets/hesabat-logo.jpg";
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import ToastNotification from '../components/ToastNotification/ToastNotification';

export default function Dekan() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);
  const [rows, setRows] = useState<String[][]>([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
  ]);

  const handleChange = async (rowIndex: number, colIndex: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex] = value;
    setRows(updatedRows);
  
    const headers = [
      'id', 
      'fealiyyat', 
      'f_qisa_mezmunu', 
      'f_nin_neticesi', 
      'movcud_veziyyetin_qiymetlendirilmesi'
    ];
  
    const columnName = headers[colIndex];
  
    const rowData = {
      id: updatedRows[rowIndex][0],
      updated_column: columnName,
      value: value
    };
  
    try {
      await apiClient.post(`/update_fealiyyet`, rowData);
      console.log(rowData);
      
      console.log('Data updated successfully');
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      ['', '', '', '', ''],
    ]);
  };

  const fetchData = async () => {
    try {
      const data = await apiClient.get(`/get_fealiyyet_rows/${'Taleh'}`);
      
      console.log(data.data);
      
      if (data && data.data.length > 0) {
        setRows(data.data.map((item: any) => [
          item.id,
          item.fealiyyat || '',
          item.f_qisa_mezmunu || '',
          item.f_nin_neticesi || '',
          item.qiymətləndirmə || ''
        ]));
      } else {
        setRows([
          ['', '', '', '', ''],
          ['', '', '', '', ''],
          ['', '', '', '', '']
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
          dispatch(logout());
          router.push("/");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        dispatch(logout());
        router.push("/");
      }
    };
    checkTokenExpiration();
    fetchData();
  }, [token]);

  return (
    <>
      <ToastNotification message='Hesabat sisteminə xoş gəlmisiniz!' />
      <div className={styles['user-container']}>
        <UserAside kafedra={null} />
        <main className={styles['user-home-main']}>
          <section className={styles['user-home-section']}>
            <h1>Plan Hesabat İnformasiya Sistemi</h1>
            <div className={styles['user-account-container']}>
              <div>
                <h2>Yekun Hesabat</h2>
                <div className={styles['user-account-table-container']}>
                  <table>
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>Fəaliyyət</th>
                        <th>Fəaliyyətin qısa məzmunu</th>
                        <th>Fəaliyyətin nəticəsi {'(İndikator)'}</th>
                        <th>Mövcud vəziyyətin qiymətləndirilməsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>
                              <input
                                type="text"
                                value={String(cell)}
                                onChange={(e) => handleChange(rowIndex, cellIndex, e.target.value)}
                                disabled={cellIndex === 0 || cellIndex === row.length - 1}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={addRow}>+</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}