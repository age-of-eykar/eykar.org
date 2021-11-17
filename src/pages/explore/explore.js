import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import MapCanvas from "../../components/map/map";
import { getDimensions } from "../../components/map/gridManager";
import debounce from "debounce";
import CardCell from "../../components/map/cellCard/card";
import Cursor from "../../components/map/exploreCursor";
import { Delaunay } from "d3-delaunay"

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
  const [coordinatesPerId, setCoordinatesPerId] = useState(new Map());
  const [biome, setBiome] = useState([0, 0, ""]);
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
  const [topLeft, setTopLeft] = useState(dimensions.topLeft);
  const [bottomRight, setBottomRight] = useState(dimensions.bottomRight);

  return (
    <div className="">
      <Header />
      <MapCanvas key={key} topLeft={topLeft} setTopLeft={setTopLeft} bottomRight={bottomRight} setBottomRight={setBottomRight}
        coordinatesPerId={coordinatesPerId} voronoi={voronoi} />
      <CardCell cellNumber={cell} coord={coord} coordinatesPerId={coordinatesPerId} biome={biome}/>
      <Cursor setCell={setCell} setCoord={setCoord} coordinatesPerId={coordinatesPerId} setBiome={setBiome}
        voronoi={voronoi} topLeft={topLeft} />
    </div>
  );

}
export default Explore;