import Header from "../../components/header/header";
import MapCanvas from "../../components/map/map"

function Explore() {

  return (
    <div className="">
      <Header />
      <MapCanvas top_left={{ x: -16, y: -16 }} bottom_right={{ x: 16, y: 16 }} />
    </div>
  );

}
export default Explore;