import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import AddPost from "../components/AddPost";

import Nav from "../components/Nav";
import Post from "../components/Post";

import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  AddPostContainer: {
    marginTop: 20,
  },

  homeNav: {},
}));

export default function Home() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;

  const classes = useStyles();

  //puso
  //states
  const [state, setstate] = useState({
    posts: [],
  });
  // eslint-disable-next-line
  const [userdata, setuserdata] = useState({
    user: [],
  });

  // eslint-disable-next-line

  //states

  //references
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);
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

  useEffect(() => {
    const fetchPost = () => {
      postsRef.orderBy("createdAt", "desc").onSnapshot((doc) => {
        let postList = [];
        doc.forEach((post) => {
          postList.push(post.data());
        });
        setstate({ posts: postList });
      });
    };
    fetchPost(); // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <Nav></Nav>

      <Container className={classes.homeNav}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            md={12}
            className={classes.AddPostContainer}
            id="AddPostContainer"
          >
            <AddPost />
          </Grid>
          {state.posts.map((states) => (
            <Grid item xs={12} md={12}>
              <Post states={states} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
