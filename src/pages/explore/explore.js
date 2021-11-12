import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import MapCanvas from "../../components/map/map";
import { getDimensions } from "../../components/map/voronoiBis";
import debounce from "debounce";
//import BiomeCanvas from "../../components/map/biomes"
import CardCell from "../../components/map/cellCard/card"

function Explore() {

  const dimensions = getDimensions({ x: 0, y: 0 }, 48);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const handler = debounce(() => setKey((oldValue) => oldValue + 1), 20);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler)
  });

  const [cell, setCell] = useState(0);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const childToParent = (currentCell, currentCoord) => {
    setCell(currentCell);
    setCoord(currentCoord);
  }

  return (
    <div className="">
      <Header />
      <MapCanvas key={key} initialTopLeft={dimensions.topLeft} initialBottomRight={dimensions.bottomRight} childToParent={childToParent} />
      <CardCell cellNumber={cell} coord={coord}/>
    </div>
  );

}
export default Explore;