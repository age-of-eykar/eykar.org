import React from "react";
import "./index.css"
import Home from './pages/home/home';
import Discover from './pages/discover/discover';
import Explore from './pages/explore/explore';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function getLibrary(provider, connector) {
  return new Web3Provider(provider);
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
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
    </Web3ReactProvider>
  );
}
