import React, { Component, useContext, useState } from 'react';
import "fontsource-roboto";
import { createTheme, ThemeProvider } from '@material-ui/core';
import { UserTokenContext } from './UserTokenContext'
import AppRouter from './components/AppRouter'

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
  const [token, setToken] = useState(
    '',   // when load for first time, default logged out state
  );

  return (
    <UserTokenContext.Provider value={{token, setToken}}>
      <ThemeProvider theme={theme}>  
        <AppRouter />
      </ThemeProvider>
    </UserTokenContext.Provider>
  )
}

export default App;
