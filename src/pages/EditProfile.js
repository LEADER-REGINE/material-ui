import React, { useState, useEffect } from "react";
import firebase, { storage } from "../utils/firebase";
import { useHistory } from "react-router-dom";
import { Avatar, Button, Card, CardHeader, Container, makeStyles, TextField } from "@material-ui/core";

import Nav from "../components/Nav";







const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",

  },

  root1: {
    maxWidth: 600,
  },

  avatar1: {
    backgroundColor: "Primary",
    width: 300,
    height: 300,


  },

}));






export default function ImageUpload() {


  const classes = useStyles();

  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;
  const [file, setFile] = useState(null); // eslint-disable-next-line
  const [url, setURL] = useState("");
  const history = useHistory();
  const [payload, setPayload] = useState({
    fname: "",
    lname: "",
  });

  function handleChange(e) {
    setFile(e.target.files[0]);
  }
  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };
  const [userdata, setuserdata] = useState({
    user: [],
  });

  //references
  var usersRef = db.collection("users").doc(UID);

  var batch = db.batch();
  //references
  useEffect(() => {
    const fetchUser = () => {
      usersRef.get().then((doc) => {
        let userList = [];
        userList.push(doc.data());
        setuserdata({ user: userList });
      });
    };
    fetchUser(); // eslint-disable-next-line
  }, []);

  function updatePic(e) {
    e.preventDefault();
    const ref = storage.ref(`/profile/images/${UID}/${file.name}`);
    const uploadTask = ref.put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      ref.getDownloadURL().then((url) => {
        setFile(null);
        setURL(url);
        usersRef
          .set(
            {
              profilePic: url,
            },
            { merge: true }
          )
          .then((doc) => {
            alert("profile update success");
            history.push("/profile");
          });
      });
    });
  }
  function handleUpload(e) {
    e.preventDefault();
    if (!payload.fname || !payload.lname) {
      alert("please fill all the fields");
    } else {
      usersRef.get().then((doc) => {
        batch.update(usersRef, {
          fname: payload.fname,
          lname: payload.lname,
        });
        batch.commit().then(() => {
          alert("profile update success");
          history.push("/profile");
        });
      });
    }
  }

  return (
    <div className={classes.root}>


      <Nav></Nav>
      <Container>

        <Card className={classes.root1} id="profileContainer1">
          <h1 style={{textAlign:"center", margin: 20}}>Edit Profile</h1>
          <div className="EditProfile-1">
            {userdata.user.map((user) => (
              <CardHeader
                style={{ display: 'flex', flexDirection: 'column' }}
                avatar={
                  <div id="center">
                    <Avatar className={classes.avatar1} id="center" style={{
                      display: "flex", flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
                      <img src={user.profilePic} style={{ width: '100%', height: '100%' }}></img>
                    </Avatar>
                  </div>
                }
              />
            ))}

            <form onSubmit={updatePic}>
              <input type="file" onChange={handleChange} accept="image/*" />
              <button disabled={!file}>Upload</button>
            </form>
          </div>
          <div className="EditProfile-1">
            <form onSubmit={handleUpload}>
              <TextField
                id="outlined-basic"
                type="text"
                label="First Name"
                name="fname"
                onChange={userInput("fname")}
                value={payload.fname}
                variant="outlined"
                style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
              />

              <TextField
                id="outlined-basic"
                type="text"
                label="Last Name"
                name="lname"
                onChange={userInput("lname")}
                variant="outlined"
                value={payload.lname}
                style={{ width: "100%", marginTop: 10 }}
              />
              <div style={{
                display: 'flex', flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
              }}>
                <Button
                  onClick={handleUpload}
                  variant='contained'
                  color='primary'
                  style={{ textTransform: 'capitalize', marginTop: 10, marginBottom: 10 }}><p style={{ color: " #fff" }}>Update Profile</p></Button> </div>
            </form>
          </div>
        </Card>
      </Container>
    </div>
  );
}
