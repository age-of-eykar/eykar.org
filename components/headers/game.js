import styles from '../../styles/components/Header.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from "react";
import { useStarknetInvoke, useStarknetTransactionManager } from '@starknet-react/core'

function Header() {
    const router = useRouter()
    const { transactions } = useStarknetTransactionManager()

    useEffect(() => {
        console.log("transactions:", transactions.length)
        for (const transaction of transactions)
            console.log(transaction)
    }, [transactions])

    const { page } = router.query
    return (
        <nav className={styles.game_nav}>
            <div className={styles.icons}>
                <Link href="/" passHref>
                    <img className={styles.logo} src="/logo.svg" alt="Eykar Logo" />
                </Link>

                <div onClick={() => router.push("/game/empire")} className={[styles.button, page === "empire" ? styles.highlighted : styles.normal, styles.button_div].join(" ")}>
                    <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    <p className={styles.button_text}>
                        Empire
                    </p>
                </div>


                <div className={[styles.button, page === "world" ? styles.highlighted : styles.normal, styles.button_div].join(" ")}>
                    <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"></path></svg>
                    <p className={styles.button_text}>
                        World
                    </p>
                </div>

                <div className={[styles.button, page === "trade" ? styles.highlighted : styles.normal, styles.button_div].join(" ")}>
                    <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    <p className={styles.button_text}>
                        Trade
                    </p>
                </div>

                <div className={[styles.button, page === "war" ? styles.highlighted : styles.normal, styles.button_div].join(" ")}>

                    <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
                    <p className={styles.button_text}>
                        Notifs ({transactions.length})
                    </p>
                </div>

            </div>
        </nav>
    );

}
export default Header;
