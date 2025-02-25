"use client";

import styles from "./page.module.scss";
import React, { useEffect, useState } from "react";
import UserAside from "@/app/components/UserAside/UserAside";
import apiClient from "@/utils/apiClient";

interface ParamsProp {
    params: Promise<{ slug: string }>;
}

interface Muellim {
    ad: string;
    soyad: string;
    ata_adi: string;
    vezife_adi: string;
    vezife_kodu: number | null;
}
interface KafedraMuduru {
    ad: string;
    soyad: string;
    ata_adi: string;
    vezife_adi: string;
    vezife_kodu: number | null;
}
export default function Page({ params }: ParamsProp) {
    const [resolvedParams, setResolvedParams] = useState<{ slug: string | null } | null>(null);
    const [kafedraName, setKafedraName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [muellimler, setMuellimler] = useState<Muellim[] | null>(null);
    const [kafedraMuduru, setKafedraMuduru] = useState<KafedraMuduru[] | null>(null);

    useEffect(() => {
        let isMounted = true;

        // Resolve params first
        params
            .then(resolved => {
                if (isMounted) {
                    setResolvedParams(resolved);
                }
                return resolved;
            })
            .catch(err => {
                console.error("Error resolving params:", err);
                if (isMounted) {
                    setError("Failed to load data.");
                }
            });

        return () => {
            isMounted = false;
        };
    }, [params]);

    useEffect(() => {
        if (resolvedParams?.slug) {
            fetchKafedralar(resolvedParams.slug);
            fetchMuellimler(resolvedParams.slug); // Fetch all muellim information
        }
    }, [resolvedParams]); // Run effect only when resolvedParams changes

    const fetchKafedralar = async (kafedra_kodu: string) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/get_kafedra_name/${kafedra_kodu}`);

            if (response.status < 200 || response.status >= 300) {
                throw new Error("Failed to fetch kafedralar");
            }

            const data = response.data;
            setKafedraName(data[0]?.kafedra_adi || "Məlumat tapılmadı");
        } catch (error) {
            console.error("Error fetching kafedralar:", error);
            setError("Kafedra məlumatı yüklənmədi.");
        }
    };

    const fetchMuellimler = async (kafedra_kodu: string) => {
        try {
            const response = await apiClient.get(`/kafedra_muellimleri/${kafedra_kodu}`);

            if (response.status < 200 || response.status >= 300) {
                throw new Error("Failed to fetch muellimler");
            }

            const data: Muellim[] = response.data;

            const filteredMuellimler = data.filter((muellim) => muellim.vezife_kodu !== 4);
            setMuellimler(filteredMuellimler);

            const mudur = data.find((muellim) => muellim.vezife_kodu === 4);
            if (mudur) {
                setKafedraMuduru([mudur]);
            }
        } catch (error) {
            console.error("Error fetching muellimler:", error);
            setError("Muellimlər məlumatı yüklənmədi.");
        }
    };

    if (!resolvedParams) {
        return <div>Yüklənir...</div>;
    }

    return (
        <div className={styles["slug-page-container"]}>
            <UserAside kafedra={kafedraName} />
            <main className={styles["kafedra-page-main"]}>
                <h1>Kafedranın vəzifəli şəxsləri</h1>
                {loading ? (
                    <p>Yüklənir...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : (
                    <p>{kafedraName}</p>
                )}

                {kafedraMuduru && kafedraMuduru.length > 0 && (
                    <section className={styles['kafedra-muduru-section']}>
                        <h2>Kafedra Müdürü :</h2>
                        {kafedraMuduru?.map((item) => {
                            return (
                                <div className={styles['kafedra-muduru-container']}>
                                    <p><strong>Ad, Soyad, Ata Adı:</strong> {item.ad} {item.soyad} {item.ata_adi}</p>
                                    <p><strong>Vəzifə:</strong> {item.vezife_adi}</p>
                                </div>
                            )
                        })}
                    </section>
                )}
                {muellimler && muellimler.length > 0 && (
                    <section className={styles['kafedra-teacher-section']}>
                        <h2>Kafedra müəllimləri : </h2>
                        {muellimler.map((muellim, index) => (
                            <div key={index} className={styles['muellim-item']}>
                                <p><strong>Ad, Soyad, Ata Adı:</strong> {muellim.ad} {muellim.soyad} {muellim.ata_adi}</p>
                                <p><strong>Vəzifə:</strong> {muellim.vezife_adi}</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}