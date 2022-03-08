import React, { useContext } from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom'
import Donate from '../pages/Donate'
import Register from '../pages/Register'
import ReturnBike from '../pages/Return'
import FindBike from '../pages/Find'
import Home from '../pages/Home'
import Landing from '../pages/Landing'
import Layout from './Layout';
import Login from '../pages/Login';
import Thanks from '../pages/Thanks';
import Error from '../pages/Error';
import ReturnSuccess from '../pages/ReturnSuccess';
import RegisterSuccess from "../pages/RegisterSuccess";
import { UserTokenContext, CheckedOutBikeContext } from "../UserTokenContext";

export default function AppRouter() {
    const { token } = useContext(UserTokenContext);
    const { checkedOutBike } = useContext(CheckedOutBikeContext);

    return (
        <Router>
            <Layout>
                <Switch>
                    <Route exact path="/">
                    <Landing />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <div id="parent">
                        <Route path="/home">
                        <Home />
                        </Route>
                        <Route path="/find">
                            
                            {token
                                ? !checkedOutBike
                                    ? <FindBike />
                                    : <Redirect to="/return" />
                                : <Redirect to="/login" />
                            }
                        </Route>
                        <Route path="/return">
                            
                            {token ? <ReturnBike /> : <Redirect to="/home" />}
                        </Route>
                        <Route path="/donate">
                            {token ? <Donate /> : <Redirect to="/home" />}
                        </Route>
                        <Route path="/thanks"><Thanks/></Route>
                        <Route path="/error"><Error/></Route>
                        <Route path="/return_success"><ReturnSuccess/></Route>
                        <Route path="/register">
                        <Register />
                        </Route>
                        <Route path="/register_success"><RegisterSuccess/></Route>
                    </div>
                </Switch>
            </Layout>
        </Router>
    )
}
