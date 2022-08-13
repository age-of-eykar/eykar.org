import styles from '../../styles/Discover.module.css'

function Page3({ direction }) {

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
                <div className={styles.card}>
                    <div>
                        <h1>Todo 3</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                    <img className={styles.mask1} src="/illustrations/warrior1.webp" alt="A warrior" />
                </div>
            </div>
        </div>
    );
}

export default Page3;
