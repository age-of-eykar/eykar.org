import styles from '../../styles/components/Slider.module.css'
import { useEffect } from "react";

function Slider({ pages, id, setPageId, setDirection }) {

    const points = [];

    useEffect(() => {
        if (typeof window === 'undefined')
            return;

        let xDown = null;
        let yDown = null;

        function handleTouchStart(evt) {
            const firstTouch = evt.touches[0];
            xDown = firstTouch.clientX;
            yDown = firstTouch.clientY;
        };

        function handleTouchMove(evt) {
            if (!xDown || !yDown) {
                return;
            }

            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;

            var xDiff = xDown - xUp;
            var yDiff = yDown - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff > 7) {
                    setPageId((id + 1) % pages.length);
                    setDirection(-1);
                } else if (xDiff < -7) {
                    setPageId((id + pages.length - 1) % pages.length);
                    setDirection(1);
                }
            }
            xDown = null;
            yDown = null;
        };

        window.addEventListener('touchstart', handleTouchStart, false);
        window.addEventListener('touchmove', handleTouchMove, false);
    }, [id, pages]);

    for (let i = 0; i < pages.length; i++) {
        points.push(
            <div
                key={i}
                onClick={i === id ? () => { } : () => setPageId(i)}
                className={i === id ? styles.big_point : styles.small_point}>
                <span className={styles.title}>{pages[i]}</span>
            </div>)
    }

    return (
        <div className={styles.slider}>
            <div className={styles.line} >
                {points}
            </div>
        </div>
    );
}
export default Slider;
