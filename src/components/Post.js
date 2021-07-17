import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardActions,
  Collapse,
  
  IconButton,
  makeStyles,
  Typography,
  TextField,
  Button,
  Container,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";

export default function Post({ states }) {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;

  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 600,
    },
    media: {
      height: "auto",
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
  }));
  const [isClick, setClick] = useState(false);

  const classes = useStyles();

  const [image, setImage] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [documentId, setdocumentId] = useState("");
  const [comments, setcomments] = useState({
    comment: [],
  });
  const handleExpandClick = (docId) => {
    setExpanded(!expanded);
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
  };

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
                  batch.commit().then(() => { });
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
                        batch.commit().then(() => { });
                      });
                    });
                });
              });
          }
        });
    });
  };

  const [payload, setPayload] = useState({
    commentBody: "",
    author: "",
  });

  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  var userRef = db.collection("users").doc(UID);
  var postsRef = db.collection("posts");

  var notifRef = db.collection("notifications");
  var batch = db.batch();
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;

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
        .then(() => { });
    });
  }
  return (
    <Card className={classes.root} elevation={2} id="cardPost">
      <CardHeader
        avatar={<Avatar className={classes.avatar} src={states.profilePic} />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={states.postAuthor} //author
        subheader={states.postedDate} //date
      />

      <CardMedia className={classes.media} image={states.img_path} />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {states.postBody}
        </Typography>
      </CardContent>

      <CardActions disableSpacing id="profileTopContainer">
        {states.heartCtr}
        <IconButton
          aria-label="add to favorites"
          value="Heart"
          isclick={isClick}
          onClick={() => {
            heartPost(states.postID);
            setClick(!isClick);
          }}
        >
          <FavoriteIcon />
        </IconButton>
        {/* <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={() => handleExpandClick(states.postID)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon></ExpandMoreIcon>
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {comments.comment.map((comment) => (
            <div>
              <Card style={{marginTop:10, marginBottom:10, padding:10}}>
                <h4>{comment.author}</h4>
                <Typography  variant="body2">{comment.comment}</Typography>
              </Card>
              
            </div>
          ))}
          <TextField
            type="text"
            label="Comment"
            name="commentBody"
            onChange={userInput("commentBody")}
            value={payload.commentBody}
            style={{width:'100%'}}
          />  
          <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", alignItems:"center", marginTop: 20}}>
          <Button onClick={() => handleComment()} >Comment</Button>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
}
