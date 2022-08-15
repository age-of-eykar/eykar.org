import styles from '../../../../styles/components/convoy/Item.module.css'

export default function Build({ color, setBuilding }) {
    const [r, g, b] = color;
    return (
        <div onClick={setBuilding} className={styles.icon_container + " info_container"} >
            <style jsx>{`
            .info_container:hover {
                color: ${'rgb(' + r + ',' + g + ',' + b + ')'}
            }
      `}</style>
            <div className={styles.icon_text}>
                Build
            </div>
            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
        </div>
    );
}
