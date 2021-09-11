import React from "react";
import "./index.css"
import Home from './pages/home';
import Discover from './pages/discover/discover';
import Explore from './pages/explore/explore';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/explore" component={Explore} />
          <Route path="/attack" component={Home} />
        </Switch>
      </main>
    </Router>
  );
}
