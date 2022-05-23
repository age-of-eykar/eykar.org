import styles from '../../styles/Game.module.css'
import { useStarknet } from '@starknet-react/core'
import { useDisplayName } from '../../hooks/starknet'
import { useRouter } from 'next/router'

export default function Tutorial({ }) {
    const { account } = useStarknet()
    const displayName = useDisplayName(account)
    const router = useRouter()
    
    return (
        <div className={[styles.box, styles.fadeIn].join(" ")}>
            <h1 className={styles.title}>Welcome, serial number {displayName}</h1>
            <p className={styles.text}>
                Several centuries ago, the star of your planet showed signs of fatigue.
                You had to leave your world where your civilization had prospered and
                flee to the depths of the cosmos with the little technology you could
                carry in your starship. You have arrived near a habitable planet called
                Eykar and you are ready to land.
            </p>
            <div className={styles.box_footer}>
                <button href="/mint" onClick={() => router.push(`/game/mint`)} className={[styles.footer_element, styles.button].join(" ")}>
                    <svg className={styles.button_icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className={styles.button_text}>Land the ship</p>
                </button>
            </div>
        </div>
    );
}
