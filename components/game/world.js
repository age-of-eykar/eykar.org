import Selected from "../selected/game";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import ViewConvoys from "../../components/game/convoys/view";
import ConvoyNotif from "./convoys/notif";

export default function World({ center, colonyIds, clicked, setClicked }) {
    const router = useRouter()
    const [showConvoys, setShowConvoys] = useState(false);
    const toggle = () => setShowConvoys(!showConvoys);
    const [selectedConvoy, setSelectedConvoy] = useState(false)

    useEffect(() => {
        if (!router.query.x || !router.query.y)
            return;
        const x = parseInt(router.query.x);
        const y = parseInt(router.query.y);
        center.current = { x, y }
        setClicked([x, y])
    }, [router.query, center, setClicked])

    return (
        <>
            {showConvoys && clicked ? <ViewConvoys
                x={clicked[0]} y={clicked[1]} toggle={toggle}
                selectedConvoy={selectedConvoy} setSelectedConvoy={setSelectedConvoy}
            /> : undefined}
            <div>
                {clicked ? <Selected x={clicked[0]} y={clicked[1]}
                    setClicked={setClicked} viewConvoys={toggle}
                    selectedConvoy={selectedConvoy} colonyIds={colonyIds} />
                    : undefined}
            </div>
            {
                selectedConvoy ? <ConvoyNotif convoyId={selectedConvoy} /> : undefined
            }
        </>
    );
}
