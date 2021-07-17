import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { Link } from "react-router-dom";
import { Button, makeStyles, Typography } from "@material-ui/core";
import "../components/css/Nav.css";

import { slide as Menu } from "react-burger-menu";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({

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
    position: "fixed",
  },

  navItems: {
    width: "100%",
  },

  navList: {
    display: "flex",
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
    textTransform: "capitalize",
  },
  

  navContainer: {
    width: 250,
  },

  burger: {
    // display: "none"
  },

  burgerContainer: {
    backgroundColor: "#3BD98A",
    width: 1000,
  },

  burgerContainer1: {
    backgroundColor: "#3BD98A",
    width: "100%",
    height: 76,
    position:"fixed",
    zIndex: 1,
    display: "none",
  },

  burgerIcon: {
    margin: 20,
    backgroundColor: "#3BD98A",
    color: "#f3f3f3",
    width: '36px',
    height: '30px',
  },

  bmBurgerButton: {
    zIndex: 1,
    position: 'fixed',
    width: '36px',
    height: '30px',
    left: '0px',
    top: '0px',

  },
  bmBurgerBars: {
    backgroundColor: "#3BD98A",
    marginTop: -80,
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em',

    textDecoration: "none",

    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }


}));

export default function Nav() {
  // eslint-disable-next-line
  const [values, setValues] = useState({
    isAuthenticated: false,
  });

  const classes = useStyles();

  const logout = (e) => {
    firebase.auth().signOut();
  };

  return (
    <div>
      <div className={classes.navContainer} id="sideNav">
        <nav className={classes.nav}>
          <ul className={classes.navItems}>
            <li className={classes.navList}>
              <Button component={Link} to="/profile" className={classes.but} classes={{ label: classes.label }}>
                <PersonOutlineOutlinedIcon className={classes.navIcon} />
                <Typography
                  variant="h6"
                  underlineNone
                  className={classes.linkText}
                >
                  {" "}
                  Profile
                </Typography>
              </Button>
            </li>

            <li className={classes.navList}>
              <Button component={Link} to="/home" className={classes.but} classes={{ label: classes.label }}>
                <HomeOutlinedIcon className={classes.navIcon} />

                <Typography variant="h6" underlineNone className={classes.linkText}>   Home</Typography>
              </Button>
            </li>

            <li className={classes.navList}>
              <Button component={Link} to="/notifications" className={classes.but} classes={{ label: classes.label }}>
                < NotificationsIcon className={classes.navIcon} />

                <Typography variant="h6" underlineNone className={classes.linkText}>   Notification</Typography>
              </Button>
            </li>

            <li className={classes.navList}>
              <Button component={Link} to="/editprofile" className={classes.but} classes={{ label: classes.label }}>
                <SettingsIcon className={classes.navIcon} />
                <Typography
                  variant="h6"
                  underlineNone
                  className={classes.linkText}
                >
                  {" "}
                  Settings
                </Typography>
              </Button>
            </li>

            <li className={classes.navList}>
              <Button component={Link} onClick={logout} className={classes.but} classes={{ label: classes.label }}>
                <ExitToAppOutlinedIcon className={classes.navIcon} />
                <Typography
                  variant="h6"
                  underlineNone
                  className={classes.linkText}
                >
                  {" "}
                  Log out
                </Typography>
              </Button>
            </li>
          </ul>
        </nav>
      </div>



      <div className={classes.burgerContainer1} id="burgerContainer1">

      </div>

      <div className={classes.burgerContainer} id="burger">
        <div className={classes.bmBurgerButton} >
          <Menu className={classes.bmBurgerBars} customBurgerIcon={<MenuIcon className={classes.burgerIcon} />} >
            <Link className={classes.bmItemList} to="/profile" >
              <div className={classes.bmItemList}>
                <PersonOutlineOutlinedIcon className={classes.navIcon} />
                <Typography variant="h6" underlineNone className={classes.linkText}>   Profile</Typography>
              </div>
            </Link>

            <Link className="menu-item" className={classes.bmItemList} to="/home">
              <div className={classes.bmItemList}>
                <HomeOutlinedIcon className={classes.navIcon} />
                <Typography variant="h6" underlineNone className={classes.linkText}>    Home  </Typography>
              </div>
            </Link>

            <Link className={classes.bmItemList} to="/notification">
              <div className={classes.bmItemList}>
                < NotificationsIcon className={classes.navIcon} />
                <Typography variant="h6" underlineNone className={classes.linkText}>   Notification </Typography>
              </div>
            </Link>

            <Link className={classes.bmItemList} to="/notification">
              <div className={classes.bmItemList}>
                <SettingsIcon className={classes.navIcon} />
                <Typography variant="h6" underlineNone className={classes.linkText}>   Setting  </Typography>
              </div>
            </Link>

            <Link onClick={logout} className={classes.bmItemList} to="">
              <div className={classes.bmItemList}>
                <ExitToAppOutlinedIcon className={classes.navIcon} />
                <Typography variant="h6" underlineNone className={classes.linkText}>   Log out</Typography>
              </div>
            </Link>
          </Menu>
        </div>
      </div>
    </div>
  );
}
