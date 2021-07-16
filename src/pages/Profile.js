import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { Link } from "react-router-dom";
import { red } from '@material-ui/core/colors';
import Nav from "../components/Nav";

import DeleteIcon from "@material-ui/icons/Delete";
import { Avatar, Card, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, makeStyles, Typography } from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
    maxWidth: 700,
    marginTop: 30,
  },
  media: {
    height: 0,
    paddingTop: '100%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  }
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
    batch.commit().then(() => { });
  };



  return (
    <div className={classes.profileContainer}>
      <div>
        <Grid item xs={12} md={12}>
          <Nav></Nav>
        </Grid>
      </div>



      <div className={classes.profileContainer1}>
        <Grid
          container
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={classes.profileContainer}
        >

          <Grid item xs={12} md={12} className={classes.AddPostContainer}>
            <h1 className="recent">Recent Posts</h1>

            {state.posts.map((states) => (
              <Card className={classes.root} elevation={3}>

                <CardHeader
                  action={
                    <IconButton onClick={() => deletePost(states.postID)}>
                      <DeleteOutline />
                    </IconButton>
                  }

                  avatar={
                    <Avatar className={classes.avatar} src={user.profilePic} />
                  }
                  title={states.postAuthor}
                  subheader={states.postedDate}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {states.postBody}
                  </Typography>
                </CardContent>


                <CardMedia
                  className={classes.media}
                  image={states.img_path}
                  title="Paella dish"
                />

              </Card>
            ))}
          </Grid>
        </Grid>
      </div>



      {/* <div className="profile-container">
        <div>
          {userdata.user.map((user) => (
            <div className="profile-top">
              <img
                src={user.profilePic}
                alt="Profile"
                className="EditProfile-img"
              />

              <div className="profile-top1">
                <div className="profile-top2">
                  <div>
                    <h1 key={UID}>
                      <p>{user.fname + " " + user.lname}</p>
                    </h1>
                  </div>
                  <Link to="/editprofile" className="profile-edit">
                    Edit
                  </Link>
                </div>
                <div className="profile-top3">
                  <h1>
                    <p>Posts: {getData.postCount}</p>
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="home-post-container">
          <h1 className="recent">Recent Posts</h1>
          {state.posts.map((states) => (
            <div key={states.postID} className="home-post">
              <div className="post-topp">
                <div className="post-top">
                  <img
                    src={states.profilePic}
                    alt="Profile"
                    className="post-profilepic"
                  />
                  <div>
                    <h4>{states.postAuthor}</h4>
                    <h6>{states.postedDate}</h6>
                  </div>

                  <div onClick={() => deletePost(states.postID)} id="cursor">
                    <DeleteIcon></DeleteIcon>
                  </div>
                </div>
                <p className="post-status">{states.postBody}</p>
                <div className="post-image-container">
                  <img src={states.img_path} alt="postImg"></img>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
