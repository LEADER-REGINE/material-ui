import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { red } from "@material-ui/core/colors";
import Nav from "../components/Nav";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    marginTop: 30,
  },
  media: {
    height: 0,
    paddingTop: "100%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },

  avatar1: {
    backgroundColor: "Primary",
    width: 100,
    height: 100,
  },
  profileContainer: {
    display: "flex",
    // flexDirection: "row",
    //width: "100%",
  },

  profileContainer1: {},

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Profile() {
  const classes = useStyles();

  const user = firebase.auth().currentUser;
  const db = firebase.firestore(); // eslint-disable-next-line
  var UID = user.uid;
  //states
  const [state, setstate] = useState({
    posts: [],
  });

  const [userdata, setuserdata] = useState({
    user: [],
    postCount: "",
  });
  const [getData, setGetdata] = useState({
    postCount: "",
  });
  //states

  //references
  var usersRef = db.collection("users").doc(UID);
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);

  var batch = db.batch();
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

  useEffect(() => {
    let isMounted = true;
    const fetchPost = () => {
      userRef
        .collection("postCollection")
        .orderBy("createdAt", "desc")
        .onSnapshot((doc) => {
          if (isMounted) {
            let postList = [];
            doc.forEach((post) => {
              postList.push(post.data());
            });
            setstate({ posts: postList });
          }
        });
    };
    fetchPost(); // eslint-disable-next-line
    return () => {
      isMounted = false;
    }; // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      userRef.collection("postCollection").onSnapshot((snap) => {
        if (isMounted) {
          let size = snap.size; // will return the collection size
          setGetdata({ postCount: size });
        }
      });
    };
    fetchData(); // eslint-disable-next-line
    return () => {
      isMounted = false;
    }; // eslint-disable-next-line
  }, []);

  const deletePost = (docId) => {
    batch.delete(usersRef.collection("postCollection").doc(docId));
    batch.delete(postsRef.doc(docId));
    batch.commit().then(() => {});
  };

  return (
    <div className={classes.profileContainer}>
      <Nav></Nav>

      <Container className={classes.profileContainer1} id="profileContainer1">
        <Grid container spacing={3} className={classes.profileContainer}>
          <Grid item xs={12} md={12} className={classes.AddPostContainer}>
            {userdata.user.map((user) => (
              <Card
                className={classes.root}
                style={{ boxShadow: "none" }}
                id="profileTopContainer"
              >
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar1}>
                      {/* eslint-disable-next-line */}
                      <img
                        src={user.profilePic}
                        style={{ width: "100%", height: "100%" }}
                      ></img>
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" color="textPrimary" component="p">
                      {user.fname + " " + user.lname}
                    </Typography>
                  }
                  subheader={<p>Posts: {getData.postCount}</p>}
                />
              </Card>
            ))}

            <div
              id="cardPost"
              style={{ maxWidth: 600, marginTop: 30, marginBottom: 30 }}
            >
              <h1 className="recent">Recent Posts</h1>
            </div>

            {state.posts.map((states) => (
              <Card
                className={classes.root}
                elevation={3}
                id="cardPost"
                style={{ marginTop: 30 }}
              >
                <CardHeader
                  action={
                    <IconButton onClick={() => deletePost(states.postID)}>
                      <DeleteOutline />
                    </IconButton>
                  }
                  avatar={
                    <Avatar
                      className={classes.avatar}
                      src={states.profilePic}
                    />
                  }
                  title={states.postAuthor}
                  subheader={states.postedDate}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {states.postBody}
                  </Typography>
                </CardContent>

                <CardMedia className={classes.media} image={states.img_path} />
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
