import styles from '../../styles/components/Slider.module.css'
import { useState, useEffect } from "react";

function Slider({ size, id, setPageId, setDirection }) {

    const points = [];
    let [changingID, setChangingID] = useState(-1);
    let [changingSize, setChangingSize] = useState(12);

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
                if (xDiff > 10) {
                    setChangingSize(0);
                    setPageId((id + 1) % size);
                    setDirection(-1);
                } else if (xDiff < -10) {
                    setChangingSize(0);
                    setPageId((id + size - 1) % size);
                    setDirection(1);
                }
            }
            xDown = null;
            yDown = null;
        };

        window.addEventListener('touchstart', handleTouchStart, false);
        window.addEventListener('touchmove', handleTouchMove, false);


        let scrolled = 0;
        let lastOffset = null;
        function onScroll(event) {
            if (event.offsetY === lastOffset) {
                scrolled += event.deltaY;
                let newId;
                if (scrolled == 0)
                    newId = -1;
                else if (scrolled > 0)
                    newId = (id + 1) % size;
                else
                    newId = (id + size - 1) % size;
                setChangingSize(12 * Math.abs(scrolled) / 150);
                setChangingID(newId)
                if (scrolled > 150) {
                    setPageId(newId);
                    setDirection(-1)
                    scrolled = 0;
                    window.scrollTo(0, 0);
                } else if (scrolled < -150) {
                    setPageId(newId);
                    setDirection(1)
                    scrolled = 0;
                }
            }
            lastOffset = event.offsetY;
        }
        window.addEventListener("wheel", onScroll);
        return () => window.removeEventListener("wheel", onScroll);
    }, [id, size]);

    for (let i = 0; i < size; i++) {

        points.push(
            <div
                key={i}
                style={i === id ? {
                    width: 24 - changingSize + 'px',
                    height: 24 - changingSize + 'px'
                }
                    : i === changingID ? {
                        width: 12 + changingSize + 'px',
                        height: 12 + changingSize + 'px'
                    }
                        : { width: 12 + 'px', height: 12 + 'px' }}
                onClick={i === id ? () => { } : () => setPageId(i)}
                className={i === id ? styles.big_point : styles.small_point}>
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
