import Header from "../components/headers/normal";
import { MapCanvas } from "../components/map/canvas";
import Selected from "../components/selected";
import { useState } from "react";

export default function Explore() {

  const [selected, setClicked] = useState(undefined)

  return (
    <>
      <Header />
      <div>{selected ? <Selected x={selected[0]} y={selected[1]} /> : undefined}</div>
      <MapCanvas onPlotClick={(x, y) => {
        setClicked((currentState) => {
          return (currentState && currentState[0] === x && currentState[1] === y)
            ? undefined : [x, y];
        })
      }} />
    </>
  );
}
