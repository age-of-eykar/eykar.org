import styles from '../styles/components/TextInput.module.css'

function ShortTextInput({ content, setContent }) {
    return (
        <div className={styles.group}>
            <input className={styles.input} type="text" required value={content} onChange={event => {
                if (event.target.value.length < 32)
                    setContent(event.target.value)
            }} />
            <span className={styles.highlight}></span>
            <span className={styles.bar}></span>
            <label className={styles.label}>How would you call it? </label>
        </div>
    );
}
export default ShortTextInput;
