import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import MapCanvas, { getDimensions } from "../../components/map/map";
import debounce from "debounce";

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
      <MapCanvas key={key} top_left={dimensions.bottom_right} bottom_right={dimensions.top_left} />
    </div>
  );

}
export default Explore;