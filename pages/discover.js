import styles from '../styles/Discover.module.css'
import Header from "../components/headers/normal";
import Slider from '../components/discover/slider';
import Page1 from '../components/discover/page1';
import Page2 from '../components/discover/page2';
import Page3 from '../components/discover/page3';
import Page4 from '../components/discover/page4';
import Page5 from '../components/discover/page5';
import { useState } from "react";

function Discover() {
    const [pageId, setPageId] = useState(0);
    const [direction, setDirection] = useState(0);
    let page;

switch (pageId) {
    case 0:
        page = <Page1 direction={direction} />
        break;

    case 1:
        page = <Page2 direction={direction} />
        break;

    case 2:
        page = <Page3 direction={direction} />
        break;

    case 3:
        page = <Page4 direction={direction} />
        break;

   case 4:
        page = <Page5 direction={direction} />
        break;
}


    return (
        <div className="default_background">
            <Header />
            <div className={styles.wrapper}>
                {page}
                <Slider size={5} id={pageId} setPageId={setPageId} setDirection={setDirection} />
            </div>
        </div>
    );
}

export default Discover;
