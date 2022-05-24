import Selected from "../selected/game";
import { useEffect } from "react";
import { useRouter } from 'next/router'

export default function World({ center, clicked, setClicked }) {
    const router = useRouter()

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
            <div>{clicked ? <Selected x={clicked[0]} y={clicked[1]} setClicked={setClicked} /> : undefined}</div>
        </>
    );
}
