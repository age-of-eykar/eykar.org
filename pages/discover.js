import styles from '../styles/Discover.module.css'
import Header from "../components/header";
import Image from 'next/image'

function Discover() {

    return (
        <div className="default_background">
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.page1}>
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
                                4 finney of ethereum (about 10$). This will allow you to acquire your
                                first land. From there you can start recruiting men, to explore
                                and conquer territory. As you expand, you will eventually meet
                                other kingdoms. You can ally with them or start a ruthless war to
                                gain prestige.
                            </p>
                            <p>
                                Prestige will play a very important role, as it will define which
                                alliance will win the game at the end of the first millennium.
                                The alliance with the most prestige will win half of the money
                                generated by the game. The other half will be used to pay for the
                                updates voted by the players with the most prestige.
                            </p>
                        </div>
                        <div>
                            <div className={styles.card}>
                                <div>
                                    <h1>Join the community</h1>
                                    <p>
                                        Come and follow the news, propose your ideas or simply discuss
                                        with the project participants on our official discord: <a href="https://discord.gg/zkWV6zVbvX">discord.eykar.org</a></p>
                                </div>
                                <Image className={styles.mask1} src="/illustrations/warrior1.webp" alt="A warrior" />
                            </div>
                            <div className={styles.card}>
                                <div>
                                    <h1>Contribute</h1>
                                    <p>
                                        You are a solidity or react developer and want to contribute?s
                                        The project is fully open source, feel free to check out our <a href="https://github.com/age-of-eykar">github</a>.
                                    </p>
                                </div>
                                <Image className={styles.mask2} src="/illustrations/warrior2.webp" alt="A warrior" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Discover;