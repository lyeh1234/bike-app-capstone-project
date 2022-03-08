import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import SignIn from './pages/Login'
import Donate from './pages/Donate'
import Register from './pages/Register'
import ReturnBike from './pages/Return'
import FindBike from './pages/Find'
import Home from './pages/Home'
import Thanks from './pages/Thanks'
import Landing from './pages/Landing'
import "fontsource-roboto";
import { createTheme, ThemeProvider } from '@material-ui/core';
import Layout from './components/Layout';

// import PrivateRoute from './components/PrivateRoute'

// console.log(localStorage.getItem('jwtToken'))
const token = localStorage.getItem('jwtToken');

const theme = createTheme({
  palette:{
    primary: {
      main: '#263238'
    }
  },
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>  
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route path="/login">
                <SignIn />
            </Route>

              {token
                  ? (
                  <div id="parent">
                    <Route path="/home">
                        <Home />
                    </Route>
                    <Route path="/find">
                      <FindBike />
                    </Route>
                    <Route path="/return">
                      <ReturnBike />
                    </Route>
                    <Route path="/donate">
                      <Donate />
                    </Route>
                    <Route path="/register">
                      <Register />
                    </Route>
                  </div>
                  )
                  : null
              }
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
 
}

export default App;
