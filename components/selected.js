import styles from '../styles/components/Selected.module.css'
import { getElevation, getTemperature, getBiomeName } from '../utils/map/biomes.js'

function Selected({ x, y, setClicked }) {

    const elevation = getElevation(x, y);
    const temperature = getTemperature(x, y);

    const biome = getBiomeName(elevation, temperature);
    let bg;
    if (biome === "Coast")
        bg = styles.coast_bg;
    if (biome === "Desert")
        bg = styles.desert_bg;
    if (biome === "Forest")
        bg = styles.forest_bg;
    if (biome === "Jungle")
        bg = styles.jungle_bg;
    if (biome === "Plain")
        bg = styles.plain_bg;
    if (biome === "Frozen Ocean")
        bg = styles.iceberg_bg;
    if (biome === "Iceberg")
        bg = styles.iceberg_bg;
    if (biome === "Frozen Land")
        bg = styles.iceberg_bg;
    if (biome === "Mountain")
        bg = styles.mountain_bg;
    if (biome === "Ice Mountain")
        bg = styles.mountain_bg;
    if (biome === "Ocean")
        bg = styles.ocean_bg;

    return (
        <div className={styles.box + " " + bg}>
            <div className={styles.box_content}>
                <h1 className={styles.title}>{biome}</h1>
                <ul>
                    <li className={styles.item}><span className={styles.item_title}>Owner</span>: <span className={styles.fg_text}>Wilderness</span></li>
                    <li className={styles.item}><span className={styles.item_title}>Location</span>: <span className={styles.bg_text}>(</span><span className={styles.fg_text}>{x}</span><span className={styles.bg_text}>,</span> <span className={styles.fg_text}>{y}</span><span className={styles.bg_text}>)</span></li>
                    <li className={styles.item}><span className={styles.item_title}>Temperature</span>: <span className={styles.fg_text}>{Math.floor((temperature + 0.6) * 20)}</span><span className={styles.bg_text}>ºC</span></li>
                    <li className={styles.item}><span className={styles.item_title}>Altitude</span>: <span className={styles.fg_text}>{Math.floor((elevation) * 1000)}</span><span className={styles.bg_text}>m</span></li>
                </ul>
                <div className={styles.buttons}>
                    <div className={styles.button}>View convoys</div>
                    <div className={styles.button}>Send convoys</div>
                </div>
            </div>
            <svg className={styles.close} onClick={() => setClicked(false)} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </div>
    );

}
export default Selected;
