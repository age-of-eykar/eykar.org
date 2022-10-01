import styles from '../../styles/components/Slider.module.css'
import { useState, useEffect } from "react";

let scrollDelay;

function Slider({ pages, id, setPageId, setDirection }) {

    const points = [];
    const [movePercentage, setMovePercentage] = useState(0.0);

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
            const time = Date.now();
            if (time < scrollDelay)
                return;

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
                    scrollDelay = time + 400;
                } else if (xDiff < -7) {
                    setPageId((id + pages.length - 1) % pages.length);
                    setDirection(1);
                    scrollDelay = time + 400;
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

            const time = Date.now();
            if (time < scrollDelay)
                return;

            if (event.offsetY === lastOffset) {
                scrolled += event.deltaY;
                let newId;
                if (scrolled == 0)
                    newId = -1;
                else if (scrolled > 0)
                    newId = (id + 1) % pages.length;
                else
                    newId = (id + pages.length - 1) % pages.length;
                if (scrolled > 150) {
                    setPageId(newId);
                    setDirection(-1)
                    scrolled = 0;
                    window.scrollTo(0, 0);
                    scrollDelay = time + 500;
                } else if (scrolled < -150) {
                    setPageId(newId);
                    setDirection(1)
                    scrolled = 0;
                    scrollDelay = time + 500;
                }
            } else {
                scrolled = 0;
            }
            setMovePercentage(Math.abs(scrolled) / 150)
            lastOffset = event.offsetY;
        }
        window.addEventListener("wheel", onScroll);

        return () => {
            window.removeEventListener("wheel", onScroll);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        }
    }, [id, pages]);

    for (let i = 0; i < pages.length; i++) {
        points.push(
            <div
                key={i}
                onClick={i === id ? () => { } : () => setPageId(i)}
                style={i === id ? { "backgroundColor": "rgba(227, 227, 227, " + (1 - movePercentage) + ")" } : {}}
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
