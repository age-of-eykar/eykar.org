import styles from '../../styles/Discover.module.css'

function Page1({ direction }) {

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
                <div className={styles.bigcard}>
                    <h1>A decentralized game</h1>
                    <p>
                        Eykar is a fantasy universe where history has yet to be written.
                        An open source smartcontract dictates the rules of this world:
                        how fast time passes, how you can move, how you can form an army,
                        and so on.
                    </p>
                    <p>
                        To register your address to the game, you will have to pay about
                        4 finney of ethereum (about 10$) to get your first land and chose 
                        your faction. From there you can start recruiting people, to explore
                        and conquer territory. As you expand, you will eventually meet
                        other kingdoms. You may become your ally or you could start a ruthless
                        war. You will gain prestige by performing different actions depending
                        on your faction.
                    </p>
                    <p>
                        Prestige will play a very important role, as it will define which
                        player or guild will win the game at the end of a season and keep
                        half of the money generated by the game. You can read the
                        litepaper <a href="https://litepaper.eykar.org">here</a>.
                    </p>
                </div>
                <div className={styles.right_cards}>
                    <div className={styles.card}>
                        <div>
                            <h1>Join the community</h1>
                            <p>
                                Come and follow the news, propose your ideas or simply discuss
                                with the project participants on our official discord: <a href="https://discord.gg/zkWV6zVbvX">discord.eykar.org</a></p>
                        </div>
                        <img className={styles.mask1} src="/illustrations/warrior1.webp" alt="A warrior" />
                    </div>
                    <div className={styles.card}>
                        <div>
                            <h1>Contribute</h1>
                            <p>
                                You are a Cairo or React developer and want to contribute?
                                The project is fully open source, feel free to check out our <a href="https://github.com/age-of-eykar">github</a>.
                            </p>
                        </div>
                        <img className={styles.mask2} src="/illustrations/warrior2.webp" alt="A warrior" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page1;
