import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import AddPost from "../components/AddPost";

import Modal from "react-modal";
import Heart from "react-animated-heart"; //puso
import Nav from "../components/Nav";
import Post from "../components/Post";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Container, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  AddPostContainer: {
    marginTop: 20,
  },
}));

export default function Home() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;

  const classes = useStyles();

  //puso
  const [isClick, setClick] = useState(false);
  const [documentId, setdocumentId] = useState("");
  //states
  const [state, setstate] = useState({
    posts: [],
  });
  const [comments, setcomments] = useState({
    comment: [],
  });
  const [userdata, setuserdata] = useState({
    user: [],
  });

  const [payload, setPayload] = useState({
    commentBody: "",
    author: "",
  });

  // eslint-disable-next-line
  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  //states

  //references
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);
  var notifRef = db.collection("notifications");
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

  const heartPost = (docId) => {
    var postsRef = db.collection("posts").doc(docId);
    let date = new Date();
    let likedDate = date.toLocaleString();
    userRef.get().then((doc) => {
      let user = doc.data().fname + " " + doc.data().lname;

      postsRef
        .collection("hearts")
        .doc(UID)
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            postsRef
              .collection("hearts")
              .doc(UID)
              .delete()
              .then(() => {
                postsRef.get().then((doc) => {
                  let heartcount = doc.data().heartCtr;
                  var newheart = heartcount - 1;
                  batch.set(
                    postsRef,
                    {
                      heartCtr: newheart,
                    },
                    { merge: true }
                  );
                  batch.commit().then(() => {});
                });
              });
          } else {
            postsRef
              .collection("hearts")
              .doc(UID)
              .set({
                value: user + " likes this post!",
                likedTime: likedDate,
                createdAt: timestamp(),
              })
              .then(() => {
                postsRef.get().then((doc) => {
                  let useruid = doc.data().userID;
                  notifRef
                    .doc(useruid)
                    .collection("notifs")
                    .doc()
                    .set({
                      value: user + " loves your post!",
                      likedTime: likedDate,
                      createdAt: timestamp(),
                    })
                    .then(() => {
                      postsRef.get().then((doc) => {
                        let heartcount = doc.data().heartCtr;
                        var newheart = heartcount + 1;
                        batch.set(
                          postsRef,
                          {
                            heartCtr: newheart,
                          },
                          { merge: true }
                        );
                        batch.commit().then(() => {});
                      });
                    });
                });
              });
          }
        });
    });
  };

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

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function handleComment() {
    let date = new Date();
    let commentDate = date.toLocaleString();

    userRef.get().then((doc) => {
      let author = doc.data().fname + " " + doc.data().lname;
      let profilePic = doc.data().profilePic;
      postsRef
        .doc(documentId)
        .collection("commentCollection")
        .add({
          comment: payload.commentBody,
          author: author,
          createdAt: timestamp(),
          postedDate: commentDate,
          userID: UID,
          profilePic: profilePic,
        })
        .then(() => {});
    });
  }

  function OpenModal(docId) {
    setIsOpen(true);
    setdocumentId(docId);

    postsRef
      .doc(docId)
      .collection("commentCollection")
      .orderBy("createdAt", "desc")
      .onSnapshot((doc) => {
        let commentList = [];
        doc.forEach((comment) => {
          commentList.push(comment.data());
        });
        setcomments({ comment: commentList });
      });
  }

  function closeModal() {
    setIsOpen(false);
  }
  Modal.setAppElement("#root");

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={classes.root}>
      <Nav></Nav>

      <Container>
        <Grid
          container
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
          xs={12}
          md={12}
        >
          <Grid item xs={12} md={12} className={classes.AddPostContainer}>
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

    // <div className="home-container">
    //   <div className="nav-container1">
    //     <Nav></Nav>
    //   </div>
    //   <div className="home2">
    //     <div className="home-left-container">
    //       <div>

    //           <AddPost></AddPost>

    //       </div>
    //       {/* <div>
    //       {userdata.user.map((user) => (
    //         <h1 key={UID}>
    //           Hello,
    //           <p>{user.fname + " " + user.lname}</p>   //name
    //         </h1>
    //       ))}
    //     </div> */}
    //     </div>
    //     <div className="home-post-container">
    //       {state.posts.map((states) => (
    //         <div key={states.postID} className="home-post">
    //           <div className="post-topp">
    //             <div className="post-top">
    //               <img
    //                 src={states.profilePic}
    //                 alt="Profile"
    //                 className="post-profilepic"
    //               />
    //               <div>
    //                 <h4>{states.postAuthor}</h4>    //author
    //                 <h6>{states.postedDate}</h6>    //date
    //               </div>
    //             </div>
    //             <p className="post-status">{states.postBody}</p>  //caption
    //             <div className="post-image-container">
    //               <img src={states.img_path} alt="postImg"></img>  //img
    //             </div>
    //           </div>
    //           <div className="post-bot">
    //             <div className="puso-ctr">{states.heartCtr}</div>

    //             <div className="puso">
    //               <Heart
    //                 value="Heart"
    //                 isclick={isClick}
    //                 onClick={() => {
    //                   heartPost(states.postID);
    //                   setClick(!isClick);
    //                 }}
    //               />
    //             </div>
    //             <div>
    //               <button onClick={() => OpenModal(states.postID)}>
    //                 Open Modal
    //               </button>
    //               <Modal
    //                 isOpen={modalIsOpen}
    //                 onRequestClose={closeModal}
    //                 contentLabel="Example Modal"
    //               >
    //                 <h2>Hello</h2>
    //                 <button onClick={closeModal}>close</button>
    //                 <div>I am a modal</div>
    //                 {comments.comment.map((comment) => (
    //                   <div>
    //                     <h4>{comment.author}</h4>
    //                     <p>{comment.comment}</p>
    //                   </div>
    //                 ))}
    //                 <input
    //                   type="text"
    //                   label="Comment"
    //                   name="commentBody"
    //                   onChange={userInput("commentBody")}
    //                   value={payload.commentBody}
    //                 ></input>
    //                 <button onClick={() => handleComment()}>Comment</button>
    //               </Modal>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
  );
}
