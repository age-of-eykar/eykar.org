import styles from '../../styles/components/Header.module.css'
import Link from 'next/link'
import { useState } from "react";

let soundGlobal = false;
const sound = typeof Audio !== "undefined" ? new Audio("./sound/eykar_theme.aac") : undefined;

function Header() {
    const [soundEnabled, toggleSound] = useState(soundGlobal)
    return (
        <nav className={styles.nav}>
            <div className={styles.icons}>
                <Link href="/" passHref>
                    <img className={styles.logo} src="/logo.svg" alt="Eykar Logo" />
                </Link>
                <Link href="/" passHref>
                    <div className={[styles.button, styles.highlighted, styles.button_div].join(" ")}>
                        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className={styles.button_text}>
                            Play
                        </p>
                    </div>
                </Link>
                <Link href="/discover" passHref >
                    <div className={[styles.button, styles.normal, styles.button_div].join(" ")}>
                        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className={styles.button_text}>
                            Discover
                        </p>
                    </div>
                </Link>
                <Link href="/world" passHref>
                    <div className={[styles.button, styles.normal, styles.button_div].join(" ")}>
                        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <p className={styles.button_text}>
                            Explore
                        </p>
                    </div>
                </Link>
                <div onClick={() => {
                    if (soundEnabled)
                        sound.pause()
                    else
                        sound.play()
                    soundGlobal = !soundEnabled;
                    toggleSound(soundGlobal)
                }} className={[styles.button, styles.normal, styles.button_div, styles.sound].join(" ")}>

                    {soundEnabled
                        ? <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        : <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>}
                </div>
            </div>
        </nav>

    );

}
export default Header;
