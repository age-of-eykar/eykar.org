import { useEffect, useState } from "react";
import debounce from "debounce";
import { getDimensions } from "../../components/map/grid/gridManager";
import Header from "../../components/header/header";
import MapCanvas from "../../components/map/map";

function Explore() {
  const dimensions = getDimensions({ x: 0, y: 0 }, 48);
  const [key, setKey] = useState(0);
  const [bottomRight, setBottomRight] = useState(dimensions.bottomRight);
  const [topLeft, setTopLeft] = useState(dimensions.topLeft);
  const [activePlots, setActivePlots] = useState(new Map());
  const inPlay = false;

  useEffect(() => {
    const handler = debounce(() => setKey((oldValue) => oldValue + 1), 20);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  });

  const voronoi = {
    data: null,
    get getVoronoi() {
      return this.data;
    },
    /**
     * @param {Delaunay} newValue
     */
    set setVoronoi(newValue) {
      this.data = newValue;
    },
  };

  const [coordinatesPerId, setCoordinatesPerId] = useState(new Map());

  return (
    <div className="">
      <Header />
      <MapCanvas
        key={key}
        coordinatesPerId={coordinatesPerId}
        voronoi={voronoi}
        bottomRight={bottomRight}
        setBottomRight={setBottomRight}
        topLeft={topLeft}
        setTopLeft={setTopLeft}       
        inPlay={inPlay}
        activePlots={activePlots}
      />
    </div>
  );
}
export default Explore;
