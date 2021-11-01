import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import MapCanvas from "../../components/map/map";
import { getDimensions } from "../../components/map/voronoiBis";
import debounce from "debounce";
import BiomeCanvas from "../../components/map/biomes"

function Explore() {

  const dimensions = getDimensions({ x: 0, y: 0 }, 48);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const handler = debounce(() => setKey((oldValue) => oldValue + 1), 20);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler)
  });

  return (
    <div className="">
      <Header />
      <MapCanvas key={key} initialTopLeft={dimensions.topLeft} initialBottomRight={dimensions.bottomRight} />
    </div>
  );

}
export default Explore;