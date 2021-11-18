import { useEffect, useState } from "react";
import debounce from "debounce";
import { getDimensions } from "../../components/map/grid/gridManager";
import PlayHeader from "../../components/header/playheader";
import MapCanvas from "../../components/map/map";
import CardCell from "../../components/cellCard/card"
import Cursor from "../../components/cursor/exploreCursor";

function Play() {

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

    return (
        <div className="">
            <PlayHeader />
            <MapCanvas key={key} topLeft={topLeft} setTopLeft={setTopLeft} bottomRight={bottomRight} setBottomRight={setBottomRight}
                setCell={setCell} setCoord={setCoord} coordinatesPerId={coordinatesPerId} voronoi={voronoi}/>
            <CardCell cellNumber={cell} coord={coord} coordinatesPerId={coordinatesPerId} biome={biome}/>
            <Cursor setCell={setCell} setCoord={setCoord} coordinatesPerId={coordinatesPerId} setBiome={setBiome}
                voronoi={voronoi} topLeft={topLeft} />
        </div>
    );

}
export default Play;