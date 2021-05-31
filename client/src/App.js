import { Route, Switch } from "react-router-dom";
import React from 'react';
import Home from './components/Home';
import Signup from './components/Signup';
import PageNotFound from './components/PageNotFound';
import AdminSignup from './components/AdminSignup';
import VoterSignup from './components/VoterSignup';
import AdminLogin from './components/AdminLogin';
import AddUserLogin from './components/AddUserLogin';

const App = () => {
    return (
      <>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/Signup">
            <Signup />
          </Route>
          <Route path="/AdminSignup">
            <AdminSignup />
          </Route>
          <Route path="/VoterSignup">
            <VoterSignup />
          </Route>
          <Route path="/AdminLogin">
            <AdminLogin />
          </Route>
          <Route path="/AddUserLogin">
            <AddUserLogin/>
          </Route>
          <Route>
            <PageNotFound />
          </Route>
        </Switch>
      </>
    )
  }
  
export default App