import styles from '../../../../styles/components/convoy/Item.module.css'

export default function Select({ color, select }) {
    const [r, g, b] = color;
    return (
        <div onClick={select} className={styles.icon_container + " info_container"} >
            <style jsx>{`
            .info_container:hover {
                color: ${'rgb(' + r + ',' + g + ',' + b + ')'}
            }
      `}</style>
            <div className={styles.icon_text}>
                Select
            </div>
            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 012 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd"></path></svg>
        </div>
    );
}
