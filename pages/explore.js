import Header from "../components/header";
import { MapCanvas } from "../components/map/canvas";

export default function Explore() {
  return (
    <>
      <Header />
      <MapCanvas setClickedPlotCallback={() => { }} />
    </>
  );
}
