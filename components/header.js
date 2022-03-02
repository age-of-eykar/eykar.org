import styles from '../styles/components/Header.module.css'
import Link from 'next/link'

function Header() {
    return (
        <nav className={styles.nav}>
            <div className={styles.icons}>
                <Link href="/">
                    <img className={styles.logo} src="/logo.svg" alt="Eykar Logo" />
                </Link>
                <Link href="/">
                    <div className={[styles.button, styles.highlighted, styles.button_div].join(" ")}>
                        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className={styles.button_text}>
                            Play
                        </p>
                    </div>
                </Link>
                <Link href="/discover" >
                    <div className={[styles.button, styles.normal, styles.button_div].join(" ")}>
                        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className={styles.button_text}>
                            Discover
                        </p>
                    </div>
                </Link>
                <Link href="/explore">
                    <div className={[styles.button, styles.normal, styles.button_div].join(" ")}>
                        <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <p className={styles.button_text}>
                            Explore
                        </p>
                    </div>
                </Link>
            </div>
        </nav>
    );

}
export default Header;
