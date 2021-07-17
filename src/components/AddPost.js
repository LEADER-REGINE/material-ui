import React, { useState, useEffect } from "react";
import firebase, { storage } from "../utils/firebase";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Fade,
  IconButton,
  makeStyles,
  Modal,
  TextareaAutosize,
  Backdrop,
  Typography,
  CardContent,
  CardActions,
  Container,
} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";

var uuid = require("uuid");

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
  },

  textarea1: {
    width: "100%",
  },

  avatar: {
    backgroundColor: "#3BD98A",
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
  },
}));

export default function ImageUpload() {
  const classes = useStyles();

  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;
  const id = uuid.v4();
  const [file, setFile] = useState(null);
  const [url, setURL] = useState("");
  const [payload, setPayload] = useState({
    postBody: "",
    heartCtr: 0,
  });

  const [userdata, setuserdata] = useState({
    user: [],
    postCount: "",
  });

  function handleChange(e) {
    setFile(e.target.files[0]);
  }
  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  //references
  var usersRef = db.collection("users").doc(UID);
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);
  var batch = db.batch();
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;
  //references

  useEffect(() => {
    const fetchUser = () => {
      userRef.get().then((doc) => {
        let userList = [];
        userList.push(doc.data());
        setuserdata({ user: userList });
      });
    };
    fetchUser(); // eslint-disable-next-line
  }, []);

  function handleUpload(e) {
    e.preventDefault();
    let date = new Date();
    let postedDate = date.toLocaleString();
    if (!file) {
      userRef.get().then((doc) => {
        let author = doc.data().fname + " " + doc.data().lname;
        let profilePic = doc.data().profilePic;
        batch.set(usersRef.collection("postCollection").doc(id), {
          postBody: payload.postBody,
          heartCtr: payload.heartCtr,
          createdAt: timestamp(),
          postAuthor: author,
          postID: id,
          postedDate: postedDate,
          userID: UID,
          profilePic: profilePic,
        });
        batch.set(postsRef.doc(id), {
          postBody: payload.postBody,
          heartCtr: payload.heartCtr,
          createdAt: timestamp(),
          postAuthor: author,
          postID: id,
          postedDate: postedDate,
          userID: UID,
          profilePic: profilePic,
        });
        batch.commit().then(() => {});
      });
    } else {
      userRef.get().then((doc) => {
        let author = doc.data().fname + " " + doc.data().lname;
        let profilePic = doc.data().profilePic;
        batch.set(usersRef.collection("postCollection").doc(id), {
          postBody: payload.postBody,
          heartCtr: payload.heartCtr,
          createdAt: timestamp(),
          postAuthor: author,
          postID: id,
          postedDate: postedDate,
          userID: UID,
          profilePic: profilePic,
        });
        batch.set(postsRef.doc(id), {
          postBody: payload.postBody,
          heartCtr: payload.heartCtr,
          createdAt: timestamp(),
          postAuthor: author,
          postID: id,
          postedDate: postedDate,
          userID: UID,
          profilePic: profilePic,
        });
        batch.commit().then(() => {
          const ref = storage.ref(`/images/${id}/${file.name}`);
          const uploadTask = ref.put(file);
          uploadTask.on("state_changed", console.log, console.error, () => {
            ref.getDownloadURL().then((url) => {
              setFile(null);
              setURL(url);
              usersRef
                .collection("postCollection")
                .doc(id)
                .update({
                  img_path: url,
                })
                .then((doc) => {
                  postsRef
                    .doc(id)
                    .update({
                      img_path: url,
                    })
                    .then(() => {});
                });
            });
          });
        });
      });
    }
  }

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card className={classes.root} elevation={2} id="addPost1">
      {userdata.user.map((data) => (
        <div>
          <CardHeader
            avatar={
              <Avatar
                src={data.profilePic}
                aria-label="recipe"
                className={classes.avatar}
              >
                R
              </Avatar>
            }
            title={
              <Button
                style={{
                  textTransform: "capitalize",
                  borderRadius: 20,
                  width: "100%",
                  justifyContent: "flex-start",
                }}
                variant="outlined"
                onClick={handleOpen}
              >
                What's on your mind, {data.fname}
              </Button>
            }
          />

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <Card xs={12} md={12}>
                <CardHeader
                  xs={12}
                  md={12}
                  title={
                    <Typography
                      variant="h5"
                      color="textSecondary"
                      component="p"
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                      }}
                    >
                      Create Post
                    </Typography>
                  }
                  id="postwidth"
                />
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar
                        src={data.profilePic}
                        aria-label="recipe"
                        className={classes.avatar}
                      ></Avatar>
                    }
                    title={data.fname + " " + data.lname}
                    style={{ width: "100%" }}
                  />

                  <CardContent>
                    <textarea
                      className={classes.textarea1}
                      id="textarea"
                      placeholder={"What's on your mind, " + data.fname + "?"}
                      className="AddPost-Input"
                      type="text"
                      label="Body"
                      name="postBody"
                      onChange={userInput("postBody")}
                      value={payload.postBody}
                      style={{
                        color: "textSecondary",
                        variant: "body1",
                        width: "100%",
                        padding: 10,
                        borderRadius: 10,
                      }}
                    />
                  </CardContent>

                  <CardContent
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="file"
                      onChange={handleChange}
                      accept="image/*"
                    >
                      Upload
                      <ImageIcon />
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpload}
                    >
                      Post
                    </Button>
                  </CardContent>
                </Card>
              </Card>
            </Fade>
          </Modal>
        </div>
      ))}
    </Card>
  );
}
