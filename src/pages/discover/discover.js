import "./discover.css"

import Header from "../../components/header/header";
import Page1 from "./page1/page1";
function Discover() {

  return (
    <div className="default_background">
      <Header />
      <div className="parent">
        <div className="container">
          <Page1 />
        </div>
      </div>
    </div>
  );
}

export default Discover;