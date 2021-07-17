import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";


import Nav from "../components/Nav";
import { Card, CardContent, CardHeader, Grid, makeStyles, Typography } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';



const useStyles = makeStyles((theme) => ({
  root: {
     display: "flex",
  },

  
}));






export default function Profile() {

  const classes = useStyles();

  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;

  const [notifs, setnotifs] = useState({
    notifs: [],
  });

  var notifRef = db.collection("notifications").doc(UID).collection("notifs");
  useEffect(() => {
    const fetchNotification = () => {
      notifRef.orderBy("createdAt", "desc").onSnapshot((doc) => {
        let notifList = [];
        doc.forEach((notif) => {
          notifList.push(notif.data());
        });
        setnotifs({ notifs: notifList });
      });
    };
    fetchNotification(); // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <Nav />
      <Grid item xs={12} md={12} id="notiTop">
        <Card id="addPost1" style={{ maxWidth: 600, padding: 20 }}>
          <CardHeader
            title="Notifications"
          />
          {notifs.notifs.map((notif) => (
            <CardContent id="profileTopContainer" style={{display:'flex' ,justifyContent:"flex-start",
            alignItems:"center", }}>
              <FavoriteIcon color="primary" style={{marginRight: 20}}></FavoriteIcon>
              <Typography variant="body2" color="textSecondary" component="p" >{notif.value}</Typography >
            </CardContent>
          ))}
        </Card>
      </Grid>
    </div>
  );
}
