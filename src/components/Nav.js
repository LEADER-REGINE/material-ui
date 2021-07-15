import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import "../components/css/Nav.css";


import { slide as Menu } from 'react-burger-menu';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuIcon from '@material-ui/icons/Menu';

export default function Nav() {// eslint-disable-next-line
  const [values, setValues] = useState({
    isAuthenticated: false,
  });

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
      <div className="nav-container">
        <nav className="nav1">
          <ul>
            <li>
              <Button component={Link} to="/profile" className="aaa">
                <PersonOutlineOutlinedIcon className="nav-icon" />
              </Button>
            </li>
            <li>
              <Button component={Link} to="/home" className="aaa">
                <HomeOutlinedIcon className="nav-icon" />
              </Button>
            </li>
            <li>
              <Button onClick={logout} id="logout" >
                < NotificationsIcon className="nav-icon" />
              </Button>
            </li>
            <li>
              <Link onClick={logout} id="logout" >
                <SettingsIcon className="nav-icon" />
              </Link>
            </li>
            <li>
              <Link onClick={logout} id="logout" >
                <ExitToAppOutlinedIcon className="nav-icon" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="nav-container2">
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
