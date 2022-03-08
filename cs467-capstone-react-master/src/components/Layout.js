import React, { useState, useContext } from 'react'
import { 
  Button,
  ButtonGroup,
  makeStyles, 
  Typography } from '@material-ui/core'
import { AppBar } from '@material-ui/core'
import { Toolbar } from '@material-ui/core'
import { useHistory} from 'react-router-dom'
import logo from './images/logo.svg';
import { UserTokenContext } from '../UserTokenContext'

const useStyles = makeStyles((theme) =>{
  return{
    
    tb: {
      minHeight:80
    },
    topSpace:{
      paddingTop: 90
    },
    logo:{
      flexGrow: 1
    },
    toolbar: theme.mixins.toolbar
  }  
})
export default function Layout({children}) {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const {token, setToken} = useContext(UserTokenContext);

  const options = [
    {
      text: 'Home',
      path: '/home'
    },
    {
      text: 'Ride!',
      path: '/find'
    },
    {
      text: 'Return',
      path: '/return'
    },
    {
      text: 'Donate',
      path: '/donate'
    },
    token ? {text: 'logout', path: '/logout'} : {text:'login', path: '/login'}]

  return (
    <div >
      <AppBar>
        <Toolbar className={classes.tb}>
        <img src={logo} alt="logo"/>
        
          <Typography 
          className={classes.logo}
          align = "left"
          component = "h2"
          variant="h5"
          color="inherit">
            <span>&nbsp;</span>Bike Kollective
          </Typography>
          
          <ButtonGroup
          size="small"
          variant="text"
          disableElevation
          color="inherit"
          align="right">
             {options.map((option) => (
          <Button key={option.text}
            onClick={() => {
              // when logout send to landing page again
              if (option.path === '/logout') {
                setToken('');   // set empty when logout
                history.push('/');
              } else {
                history.push(option.path)
              }
            }}>{option.text}
          </Button>
             ))}
        </ButtonGroup>
        
        </Toolbar>
      </AppBar>
      
      <div className={classes.page}>
        <div className={classes.topSpace}></div>
        {children}
      </div>
    </div>
  )
}
