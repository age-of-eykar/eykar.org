import Selected from "../../components/selected";
import { useState } from "react";
import { useRouter } from 'next/router'

export default function World({ center, clicked }) {
    const router = useRouter()
    const x = parseInt(router.query.x);
    const y = parseInt(router.query.y);
    center.current = { x, y }
    const [selected, setClicked] = useState(clicked
        ? [x, y] : undefined)

    return (
        <>
            <div>{selected ? <Selected x={selected[0]} y={selected[1]} setClicked={setClicked} /> : undefined}</div>
        </>
    );
}
