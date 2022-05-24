import Selected from "../selected/game";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import ViewConvoys from "../../components/game/convoys/view";

export default function World({ center, clicked, setClicked }) {
    const router = useRouter()
    const [showConvoys, setShowConvoys] = useState(false);
    const toggle = () => setShowConvoys(!showConvoys);

    useEffect(() => {
        if (!router.query.x || !router.query.y)
            return;
        const x = parseInt(router.query.x);
        const y = parseInt(router.query.y);
        center.current = { x, y }
        setClicked([x, y])
    }, [router.query])

    return (
        <>
            {showConvoys ? <ViewConvoys x={clicked[0]} y={clicked[1]} toggle={toggle} /> : undefined}
            <div>{clicked ? <Selected x={clicked[0]} y={clicked[1]}
                setClicked={setClicked} viewConvoys={toggle} sendConvoys={() => { }} /> : undefined}</div>
        </>
    );
}
