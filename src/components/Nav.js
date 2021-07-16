import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { Link } from "react-router-dom";
import { Button, makeStyles, Typography } from "@material-ui/core";
import "../components/css/Nav.css";


import { slide as Menu } from 'react-burger-menu';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from "classnames";


const useStyles = makeStyles((theme) => ({
  burger: {
    display: 'none',
  },

  // navContainer: {
  //   backgroundColor: "#3BD98A",
  //   width: 300,
  //   height: "100vh",
  //   position: "fixed",
  // },

  nav: {
    backgroundColor: "#3BD98A",
    opacity: 1,
    width: 250,
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    position: "fixed"
  },

  navItems: {
    width: "100%",
  },

  navList: {
    display: 'flex',
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,

  },

  but: {
    width: "90%",
    paddingTop: 25,
    paddingBottom: 25,
    display: "flex",
    flexDirection: "row",
    textDecoration: "none",
    justifyContent: "flex-start",
    alignItems: "center",
    color: "#f5f5f5",
  },

  navIcon: {
    color: "#fff",
    height: 28,
    width: 28,
    marginLeft: 10,
    marginRight: 10,
  },

  linkText: {
    color: "#f5f5f5",
  },

  label: {
    textTransform: 'capitalize',
  },

  navContainer: {
    width: 300,
  }

}));











export default function Nav() {// eslint-disable-next-line
  const [values, setValues] = useState({
    isAuthenticated: false,
  });

  const classes = useStyles();

  const logout = (e) => {
    firebase.auth().signOut();

  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setValues({ isAuthenticated: true });
        let x = document.getElementById("logout");
        x.style.display = "inline";
      } else {
        setValues({ isAuthenticated: false });
        let x = document.getElementById("logout");
        x.style.display = "none";
      }
    });
  }, []);
  return (
    <div>
      <div className={classes.navContainer} id="sideNav">
        <nav className={classes.nav}>
          <ul className={classes.navItems}>
            <li className={classes.navList}>
              <Button component={Link} to="/profile" className={classes.but} classes={{label: classes.label}}> 
                <PersonOutlineOutlinedIcon className={classes.navIcon} />
                <Typography variant="h6" underlineNone className={classes.linkText}>   Profile</Typography>
              </Button>
            </li>

            <li className={classes.navList}>
              <Button component={Link} to="/home" className={classes.but} classes={{label: classes.label}}>
                <HomeOutlinedIcon className={classes.navIcon} />
                 
                <Typography variant="h6" underlineNone className={classes.linkText}>   Home</Typography>
              </Button>
            </li>

            <li className={classes.navList}>
              <Button onClick={logout} className={classes.but} classes={{label: classes.label}}>
                < NotificationsIcon className={classes.navIcon} />
                 
                <Typography variant="h6" underlineNone className={classes.linkText}>   Notification</Typography>
              </Button>
            </li>

            <li className={classes.navList}>
              <Button component={Link} onClick={logout} className={classes.but} classes={{label: classes.label}}>
                <SettingsIcon className={classes.navIcon} />
                <Typography variant="h6" underlineNone className={classes.linkText}>   Settings</Typography>
              </Button>
            </li>

            <li className={classes.navList}>
              <Button component={Link} onClick={logout} className={classes.but} classes={{label: classes.label}}>
                <ExitToAppOutlinedIcon className={classes.navIcon} />
                <Typography variant="h6" underlineNone className={classes.linkText}>   Log out</Typography>
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      <div className={classes.burger}>
        <Menu className="nav2" customBurgerIcon={<MenuIcon />} >
          <a id="home" className="menu-item" href="/home">Home</a>
          <a id="profile" className="menu-item" href="/profile">About</a>
          <a id="contact" className="menu-item" href="/profile">Contact</a>
          <a onClick={logout} className="menu-item--small" href="">Settings</a>
        </Menu>
      </div>
    </div>
  );
}
