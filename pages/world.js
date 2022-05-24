import Header from "../components/headers/normal";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { MapCanvas } from "../components/map/canvas";
import Selected from "../components/selected/offline";

export default function World() {

  const [selected, setClicked] = useState(undefined)
  const { query } = useRouter();

  // center of the map (normal coordinates)
  const center = useRef({ x: 0.0, y: 0.0 });
  if (query.x && query.y) {
    center.current.x = parseInt(query.x);
    center.current.y = parseInt(query.y);
  }

  return (
    <>
      <Header />
      <div>{selected ? <Selected x={selected[0]} y={selected[1]} setClicked={setClicked} /> : undefined}</div>
      <MapCanvas center={center} onPlotClick={(x, y) => {
        setClicked((currentState) => {
          return (currentState && currentState[0] === x && currentState[1] === y)
            ? undefined : [x, y];
        })
      }} />
    </>
  );
}
