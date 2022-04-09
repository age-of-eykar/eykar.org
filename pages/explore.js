import Header from "../components/headers/normal";
import { MapCanvas } from "../components/map/canvas";

export default function Explore() {
  return (
    <>
      <Header />
      <MapCanvas onPlotClick={(x, y) => { }} />
    </>
  );
}
