import { useEffect, useState, useRef } from "react";
import debounce from "debounce";
import { getDimensions } from "../../components/map/grid/gridManager";
import Header from "../../components/header/header";
import MapCanvas from "../../components/map/map";
import Cursor from "../../components/cursor/exploreCursor";

function Explore() {

  const dimensions = getDimensions({ x: 0, y: 0 }, 48);
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    const handler = debounce(() => setKey((oldValue) => oldValue + 1), 20);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler)
  });

  const voronoi = {
    data : null,
    get getVoronoi() {
      return this.data;
    },
    /**
     * @param {Delaunay} newValue
     */
    set setVoronoi(newValue) {
      this.data = newValue;
    }
  }

  const [cell, setCell] = useState(0);
  const [coord, setCoord] = useState({ x: 0, y: 0 });
  const [coordinatesPerId, setCoordinatesPerId] = useState(new Map());
  const [biome, setBiome] = useState([0, 0, ""]);
  const [topLeft, setTopLeft] = useState(dimensions.topLeft);
  const [bottomRight, setBottomRight] = useState(dimensions.bottomRight);
  const [xPrefix, setXPrefix] = useState(0);
  const [yPrefix, setYPrefix] = useState(0);
  const xStep = useRef(1);
  const yStep = useRef(1);

  return (
    <div className="">
      <Header />
      <MapCanvas key={key} xStep={xStep} yStep={yStep} xPrefix={xPrefix} yPrefix={yPrefix} topLeft={topLeft} setTopLeft={setTopLeft} bottomRight={bottomRight} setBottomRight={setBottomRight}
        coordinatesPerId={coordinatesPerId} voronoi={voronoi} />
      <Cursor xStep={xStep} yStep={yStep} xPrefix={xPrefix} setXPrefix={setXPrefix} yPrefix={yPrefix} setYPrefix={setYPrefix} setCoord={setCoord} setCell={setCell} coordinatesPerId={coordinatesPerId} voronoi={voronoi} setTopLeft={setTopLeft} topLeft={topLeft}
        setBiome={setBiome} bottomRight={bottomRight} setBottomRight={setBottomRight} />
    </div>
  );

}
export default Explore;