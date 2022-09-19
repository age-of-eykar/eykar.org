import styles from '../../styles/Discover.module.css'

function Page2({ direction }) {

    let directionStyle;
    if (direction === -1)
        directionStyle = styles.in_right;
    else if (direction === 1)
        directionStyle = styles.in_left;
    else
        directionStyle = "";


    return (
        <div className={[styles.page1, directionStyle].join(" ")}>
            <div className={styles.cards}>

                <div className={[styles.vertical_card, styles.bg_diplomat].join(" ")}>
                    <div className={styles.vertical_content}>
                        <h1>Diplomats</h1>
                        <p>Diplomats gain prestige by establishing unions between kingdoms. They have their place at the head of powerful guilds to bend the world to their will.</p>
                    </div>
                </div>

                <div className={[styles.vertical_card, styles.bg_warlord].join(" ")}>
                    <div className={styles.vertical_content}>
                        <h1>Warlords</h1>
                        <p>Warlords gain prestige by destroying other empires. They can put violence in the service of the wealthy or stand on the side of good and defend the just causes.</p>
                    </div>
                </div>

                <div className={[styles.vertical_card, styles.bg_merchant].join(" ")}>
                    <div className={styles.vertical_content}>
                        <h1>Merchants</h1>
                        <p>Merchants gain prestige by trading. They establish trade routes and go in search of the most sought-after resources from other kingdoms.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Page2;
