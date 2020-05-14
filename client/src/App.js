import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import PraivateRoute from "./components/routing/PraivateRoute";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import "./App.css";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Navbar />

        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/profiles' component={Profiles} />
            <Route exact path='/profile/:id' component={Profile} />

            <PraivateRoute exact path='/dashboard' component={Dashboard} />
            <PraivateRoute
              exact
              path='/create-profile'
              component={CreateProfile}
            />
            <PraivateRoute exact path='/edit-profile' component={EditProfile} />
            <PraivateRoute
              exact
              path='/add-experience'
              component={AddExperience}
            />
            <PraivateRoute
              exact
              path='/add-education'
              component={AddEducation}
            />
            <PraivateRoute exact path='/posts' component={Posts} />
            <PraivateRoute exact path='/posts/:id' component={Post} />
          </Switch>
        </section>
      </Router>
    </Provider>
  );
};

export default App;
