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
                <div className={[styles.mixed_card, styles.bg_map].join(" ")}>
                    <div>
                        <h1>The world</h1>
                        <p>Eykar world is not infinite, but comes very close. The map divides
                            the world into small polygonal territories called plots. There are
                            more of these than there are atoms in our universe and they all
                            have different properties. Their altitude and climate determine
                            the interactions players can have with them.</p>
                    </div>
                </div>

                <div className={[styles.mixed_card, styles.bg_diplomat].join(" ")}>
                    <div>
                        <h1>The guilds</h1>
                        <p>When your colony gets big enough to be meaningful to other players,
                            you may decide to ally rather than attacking them. Guilds allow to
                            manage territories and resources shared by several players. They
                            also help diplomacy by allowing the creation of peace treaties and
                            make trading more fluid by allowing guilds to issue their own tokens.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Page3;
